const Meme = require('../db/models/meme-model');
const Template = require('../db/models/template-model');
const Comment = require('../db/models/comments-model');
const User = require('../db/models/user-model');
const MemeStats = require('../db/models/memestats-model');
const TemplateStats = require('../db/models/templatestats-model');
const IDManager = require('../db/id-manager');
const constants = require('../utils/constants');
const globalHelpers = require('../utils/globalHelpers');
const idManager = require('../db/id-manager');


/**
 * create new meme
 * @param {*} req 
 * @param {*} res 
 */
const createMeme = async(req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No meme data received!'
        })
    }

    if (req.files && req.files.image) { //check if we actually received a file
        let img = req.files.image;
        let id = IDManager.getNewEmptyMemeID();
        let filename = id + "_" + img.name; //ID in addition to name in order to prevent unwanted overrides
        let url = '/memes/' + filename;
        img.mv('public' + url, async function(err) { //this overwrites an existing image at that filepath if there is one!
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.toString()
                });
            }
            body.id = id;
            body.url = url;
            saveMeme(body, res);
        });
    } else if (body.imageURL) {
        body.id = IDManager.getNewEmptyMemeID();
        body.url = body.imageURL;
        saveMeme(body, res);

    } else {
        return res.status(400).json({
            success: false,
            error: 'No valid file received!'
        });
    }
}

/**
 * Save a meme to the database
 * @param {*} params 
 * @param {*} res 
 */
const saveMeme = (params, res) => {
    const meme = new Meme({
        _id: params.id,
        url: params.url,
        name: params.name,
        user_id: params.userID,
        template_id: params.templateID,
        visibility: params.visibility,
        captions: params.captions,
        comment_ids: [],
        creationDate: globalHelpers.getTodayString(),
        stats: {
            upvotes: [],
            downvotes: [],
            views: 0
        }
    });

    if (!meme) {
        return res.status(400).json({
            success: false,
            error: "Meme data could not be parsed for storing!"
        });
    }

    meme
        .save()
        .then(async() => {
            await addTemplateUse(params.templateID);
        })
        .then(() => {
            IDManager.registerNewMemeEntry();
            return res.status(201).json({
                success: true,
                id: meme._id,
                error: 'Meme successfully stored!'
            })
        })
        .catch(dbError => {
            return res.status(500).json({
                success: false,
                error: 'Meme could not be stored! You should find additional error info in the detailedError property of this JSON.',
                detailedError: dbError
            })
        })
}

/**
 * Delete a meme from the database
 * @param {*} req 
 * @param {*} res 
 */
const deleteMeme = async(req, res) => {
    await Meme.findOneAndDelete({ _id: req.params.id }, (err, meme) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!meme) {
            return res
                .status(404)
                .json({ success: false, error: `Meme not found` })
        }

        return res.status(200).json({ success: true, data: meme })
    }).catch(err => console.log(err))
}

/**
 * Get a meme by given id
 * @param {*} req 
 * @param {*} res 
 */
const getMemeById = async(req, res) => {
    await Meme.findOne({ _id: req.params.id }, (err, meme) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!meme) {
            return res
                .status(404)
                .json({ success: false, error: `Meme not found` })
        }
        return res.status(200).json({ success: true, data: meme })
    }).catch(err => console.log(err))
}

/**
 * Get all memes in the database
 * @param {*} req 
 * @param {*} res 
 */
const getMemes = async(req, res) => {
    let userId = req.query.userId; //will be undefined if none is sent, and thus match no meme user_id
    //send own, public and unlisted memes (unlisted to enable access via direct links), but non-public memes will be filtered out in the frontend from regular navigation and lists
    await Meme.find({ $or: [{ visibility: constants.VISIBILITY.PUBLIC }, { visibility: constants.VISIBILITY.UNLISTED }, { user_id: userId }] }, async(err, memes) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        let resultArray = [];

        //convert the results from Documents to JSON objects, otherwise we can't add properties that are not defined in the model
        memes.forEach((m) => {
            resultArray.push(m.toJSON());
        });

        //add username and templatename from other DB models
        for (let i = 0; i < resultArray.length; i++) {
            let entry = resultArray[i];

            let userID = entry.user_id;
            let templateID = entry.template_id;

            let user = await User.findOne({ _id: userID });
            if (user) entry.user_name = user.username;

            let template = await Template.findOne({ _id: templateID });
            if (template) entry.template_name = template.name;
        }

        return res.status(200).json({ success: true, data: resultArray })
    }).catch(err => console.log(err))
}

/**
 * Get all created memes by user id
 * @param {*} req 
 * @param {*} res 
 */
const getOwnMemes = async(req, res) => {
    let userId = req.query.userId;
    await Meme.find({ user_id: userId }, (err, memes) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: memes })
    }).catch(err => console.log(err))
}

/**
 * Get all comments by given meme id
 * @param {*} req 
 * @param {*} res 
 */
const getCommentsByMemeId = async(req, res) => {
    let memeId = req.params.id;
    console.log("TRYING HARD TO GET COMMENTS")
    console.log(memeId)
    try {
        let memeId = req.params.id;
        let meme = await Meme.findOne({ _id: memeId })
        console.log("MEME: ", meme)
        let commentIdsArray = meme.comment_ids
        console.log("commentIdsArray", commentIdsArray)
        let comments = await Comment.find().where('_id').in(commentIdsArray).exec();
        console.log("comments", comments)
        return res.status(200).json({ success: true, data: comments })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}

/**
 * Saves comment under new id into db
 * @param {*} req 
 * @param {*} res 
 */
const postComment = async(req, res) => {

    let received_user_id = req.params.id
    let meme_id = req.body.memeId
    let received_message = req.body.message
    let comment_id = idManager.getNewEmptyCommentID()
    let date = globalHelpers.getTodayString();
    let comment = new Comment({ _id: comment_id, user_id: received_user_id, message: received_message, creationDate: date });

    try {
        // UPDATE MEME -> COMMENT ID INSERTED
        await Meme.updateOne({ _id: meme_id }, { $push: { 'comment_ids': comment_id } })
            //SAVE COMMENT
        comment.save(function(err, doc) {
            if (err) return console.error(err);
            console.log("Document inserted succussfully!");
        });
        idManager.registerNewCommentEntry()
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}

// TODO: CHECK IF USED?!
const patchMeme = async function(req, res) {
    console.log("Patch Meme generic")
    var body = req.body;
    var memeId = req.params.id;
    var updatedProperty = body.toUpdate
    const result = await Meme.updateOne({ _id: memeId }, updatedProperty)
    console.log(result);
}

/**
 * Adds a SINGLE view to database meme.stats by given id when called
 * @param {*} req 
 * @param {*} res 
 */
const viewMeme = async(req, res) => {
    try {
        let memeId = req.params.id;
        await Meme.updateOne({ _id: memeId }, { $inc: { 'stats.views': 1 } });

        let date = globalHelpers.getTodayString();
        MemeStats.findOneAndUpdate({ _id: memeId, 'days.date': date }, { $inc: { 'days.$.views': 1 } }, async(err, memeStats) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!memeStats) {
                await MemeStats.updateOne({ _id: memeId }, { $push: { 'days': { date: date, views: 1 } } })
            }
            return res.status(200).json({ success: true });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}

/**
 * Template used
 * @param {*} templateId 
 */
const addTemplateUse = async(templateId) => {
    try {
        await Template.updateOne({ _id: templateId }, { $inc: { 'stats.uses': 1 } });

        let date = globalHelpers.getTodayString();
        TemplateStats.findOneAndUpdate({ _id: templateId, 'days.date': date }, { $inc: { 'days.$.uses': 1 } }, async(err, templateStats) => {
            if (err) {
                throw new Error("Could not update template used counter!");
            }
            if (!templateStats) {
                await TemplateStats.updateOne({ _id: templateId }, { $push: { 'days': { date: date, uses: 1 } } })
            }
            return res.status(200).json({ success: true });
        })
    } catch (err) {
        console.log(err);
    }
}

/**
 * updates upvotes per meme
 * @param {*} req 
 * @param {*} res 
 */
const toggleUpvoteMeme = async(req, res) => {
    try {
        let memeId = req.params.id;
        let userId = req.body.userId;
        let newValue = req.body.newValue;

        if (newValue) { //check if we want to downvote or de-downvote
            await Meme.updateOne({ _id: memeId }, { $push: { 'stats.upvotes': userId } });

            //daily stats only register votes, no de-votes. Assuming users don't go overboard with this option, this makes it easier to compare "real" interactions over time, and also makes for better testing.
            let date = globalHelpers.getTodayString();
            MemeStats.findOneAndUpdate({ _id: memeId, 'days.date': date }, { $inc: { 'days.$.upvotes': 1 } }, async(err, memeStats) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err });
                }
                if (!memeStats) {
                    await MemeStats.updateOne({ _id: memeId }, { $push: { 'days': { date: date, upvotes: 1 } } });
                }
                return res.status(200).json({ success: true });
            })
        } else {
            await Meme.updateOne({ _id: memeId }, { $pull: { 'stats.upvotes': userId } });
            return res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}

/**
 * Updates downvotes per meme
 * @param {*} req 
 * @param {*} res 
 */
const toggleDownvoteMeme = async(req, res) => {
    try {
        let memeId = req.params.id;
        let userId = req.body.userId;
        let newValue = req.body.newValue;

        if (newValue) { //check if we want to downvote or de-downvote
            await Meme.updateOne({ _id: memeId }, { $push: { 'stats.downvotes': userId } });

            //daily stats only register votes, no de-votes. Assuming users don't go overboard with this option, this makes it easier to compare "real" interactions over time, and also makes for better testing.
            let date = globalHelpers.getTodayString();
            MemeStats.findOneAndUpdate({ _id: memeId, 'days.date': date }, { $inc: { 'days.$.downvotes': 1 } }, async(err, memeStats) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err });
                }
                if (!memeStats) {
                    await MemeStats.updateOne({ _id: memeId }, { $push: { 'days': { date: date, downvotes: 1 } } });
                }
                return res.status(200).json({ success: true });
            })
        } else {
            await Meme.updateOne({ _id: memeId }, { $pull: { 'stats.downvotes': userId } });
            return res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}


module.exports = {
    createMeme,
    deleteMeme,
    patchMeme,
    viewMeme,
    toggleUpvoteMeme,
    toggleDownvoteMeme,
    getMemes,
    getCommentsByMemeId,
    postComment,
    getOwnMemes,
    getMemeById
}