const Template = require('../db/models/template-model');
const TemplateStats = require('../db/models/templatestats-model');
const dbUtils = require('../db/dbUtils');
const constants = require('../utils/constants');
const globalHelpers = require('../utils/globalHelpers');

const createTemplate = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No template data received!'
        })
    }

    if(req.files && req.files.image){ //check if we actually received a file
        let img = req.files.image;
        let id = await dbUtils.getNewEmptyTemplateID();
        let filename = id+"_"+img.name; //ID in addition to name in order to prevent unwanted overrides
        let url = '/templates/'+filename;
        img.mv('public'+url, async function(err){ //this overwrites an existing image at that filepath if there is one!
            if(err){
                return res.status(500).json({
                    success: false,
                    error: err.toString()
                });
            }
            body.id = id;
            body.url = url;
            saveTemplate(body, res);

        });
    }else if(body.imageURL){
        body.id = await dbUtils.getNewEmptyTemplateID();
        body.url = body.imageURL;
        saveTemplate(body, res);

    }else{
        return res.status(400).json({
            success: false,
            error: 'No valid file received!'
        });
    }
}

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

const getTemplates = async (req, res) => {
    let userId = req.query.userId; //will be undefined if none is sent, and thus match no template user_id
    //send own and public templates
    await Template.find({ $or: [ {visibility: constants.VISIBILITY.PUBLIC}, {user_id: userId} ] }, (err, templateArray) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // if (!templateArray.length) {
        //     return res
        //         .status(204)
        //         .json({ success: false, error: `No templates found` })
        // }
        return res.status(200).json({ success: true, data: templateArray })
    }).catch(err => console.log(err))
}


const upvoteTemplate = async(req, res) => {
    try {
        let templateId = req.params.id;
        let userId = req.body.userId;

        await Template.updateOne({ _id: templateId }, { $push: { 'stats.upvotes': userId } });

        let date = globalHelpers.getTodayString();
        TemplateStats.findOneAndUpdate({ _id: templateId, 'days.date': date }, { $inc: { 'days.$.upvotes': 1 } }, async(err, templateStats) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!templateStats) {
                await TemplateStats.updateOne({ _id: templateId }, { $push: { 'days': { date: date, upvotes: 1 } } });
            }
            return res.status(200).json({ success: true });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}

const downvoteTemplate = async(req, res) => {
    try {
        let templateId = req.params.id;
        let userId = req.body.userId;

        await Template.updateOne({ _id: templateId }, { $push: { 'stats.downvotes': userId } });

        let date = globalHelpers.getTodayString();
        TemplateStats.findOneAndUpdate({ _id: templateId, 'days.date': date }, { $inc: { 'days.$.downvotes': 1 } }, async(err, templateStats) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!templateStats) {
                await TemplateStats.updateOne({ _id: templateId }, { $push: { 'days': { date: date, downvotes: 1 } } });
            }
            return res.status(200).json({ success: true });
        })
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
    upvoteTemplate,
    downvoteTemplate,
}