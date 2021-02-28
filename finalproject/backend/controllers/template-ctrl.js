const Template = require('../db/models/template-model');
const TemplateStats = require('../db/models/templatestats-model');
const IDManager = require('../db/id-manager');
const constants = require('../utils/constants');
const globalHelpers = require('../utils/globalHelpers');
const webcontentCtrl = require('./webcontent-ctrl');

/**
 * creates and saves am new template into the db
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object
 */
const createTemplate = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No template data received!'
        })
    }

    if (req.files && req.files.image) { //check if we actually received a file
        let img = req.files.image;
        let id = IDManager.getNewEmptyTemplateID();
        let filename = id + "_" + img.name; //ID in addition to name in order to prevent unwanted overrides
        let url = '/templates/' + filename;
        img.mv('public' + url, async function (err) { //this overwrites an existing image at that filepath if there is one!
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.toString()
                });
            }
            body.id = id;
            body.url = url;
            saveTemplate(body, res);

        });
    } else if (body.imageURL) {
        body.id = IDManager.getNewEmptyTemplateID();
        try {
            let localURL = await webcontentCtrl.loadAndStoreImageFromWeb(body.imageURL, 'templates');
            body.url = localURL;
            saveTemplate(body, res);
        }catch(err){
            console.log('Failed to load remote template', err.toString());
            return res.status(500).json({
                success: false,
                error: 'Could not load remote template!'
            });
        }

    } else {
        return res.status(400).json({
            success: false,
            error: 'No valid file received!'
        });
    }
}

/**
 * save template (helper method)
 * @param {*} params 
 * @param {*} res 
 */
const saveTemplate = (params, res) => {
    const template = new Template({
        _id: params.id,
        url: params.url,
        name: params.name,
        user_id: params.userID,
        visibility: params.visibility,
        stats: {
            upvotes: [],
            downvotes: [],
            uses: 0
        }
    });

    if (!template) {
        return res.status(400).json({
            success: false,
            error: "Template data could not be parsed for storing!"
        });
    }

    template
        .save()
        .then(() => {
            const statEntry = new TemplateStats({
                _id: params.id
            });

            return statEntry.save();
        })
        .then(() => {
            IDManager.registerNewTemplateEntry();
            return res.status(201).json({
                success: true,
                id: template._id
            })
        })
        .catch(dbError => {
            return res.status(500).json({
                success: false,
                error: 'Template could not be stored! You should find additional error info in the detailedError property of this JSON.',
                detailedError: dbError
            })
        })
}

/**
 * deletes a specific template from the database
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object 
 */
const deleteTemplate = async (req, res) => {
    await Template.findOneAndDelete({ _id: req.params.id }, (err, template) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!template) {
            return res
                .status(404)
                .json({ success: false, error: `Template not found` })
        }

        return res.status(200).json({ success: true, data: template })
    }).catch(err => console.log(err))
}

/**
 * gets a specific template by a given id
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object
 */
const getTemplateById = async (req, res) => {
    await Template.findOne({ _id: req.params.id }, (err, template) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!template) {
            return res
                .status(404)
                .json({ success: false, error: `Template not found` })
        }
        return res.status(200).json({ success: true, data: template })
    }).catch(err => console.log(err))
}

/**
 * gets all templates from database
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object
 */
const getTemplates = async (req, res) => {
    let userId = req.query.userId; //will be undefined if none is sent, and thus match no template user_id
    //send own and public templates
    await Template.find({ $or: [{ visibility: constants.VISIBILITY.PUBLIC }, { user_id: userId }] }, (err, templateArray) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, data: templateArray })
    }).catch(err => console.log(err))
}

/**
 * functionality when a template is upvoted
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object 
 */
const toggleUpvoteTemplate = async (req, res) => {
    try {
        let templateId = req.params.id;
        let userId = req.body.userId;
        let newValue = req.body.newValue;

        if (newValue) { //check if we want to upvote or de-upvote
            await Template.updateOne({ _id: templateId }, { $push: { 'stats.upvotes': userId } });

            let date = globalHelpers.getTodayString();
            TemplateStats.findOneAndUpdate({ _id: templateId, 'days.date': date }, { $inc: { 'days.$.upvotes': 1 } }, async (err, templateStats) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err });
                }
                if (!templateStats) {
                    await TemplateStats.updateOne({ _id: templateId }, { $push: { 'days': { date: date, upvotes: 1 } } });
                }
                return res.status(200).json({ success: true });
            })
        } else {
            await Template.updateOne({ _id: templateId }, { $pull: { 'stats.upvotes': userId } });
            return res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}

/**
 * functionality when a template is downvoted
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object 
 */
const toggleDownvoteTemplate = async (req, res) => {
    try {
        let templateId = req.params.id;
        let userId = req.body.userId;
        let newValue = req.body.newValue;

        if (newValue) { //check if we want to downvote or de-downvote
            await Template.updateOne({ _id: templateId }, { $push: { 'stats.downvotes': userId } });

            let date = globalHelpers.getTodayString();
            TemplateStats.findOneAndUpdate({ _id: templateId, 'days.date': date }, { $inc: { 'days.$.downvotes': 1 } }, async (err, templateStats) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err });
                }
                if (!templateStats) {
                    await TemplateStats.updateOne({ _id: templateId }, { $push: { 'days': { date: date, downvotes: 1 } } });
                }
                return res.status(200).json({ success: true });
            })
        } else {
            await Template.updateOne({ _id: templateId }, { $pull: { 'stats.downvotes': userId } });
            return res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}


module.exports = {
    createTemplate,
    deleteTemplate,
    getTemplates,
    getTemplateById,
    toggleUpvoteTemplate,
    toggleDownvoteTemplate,
}