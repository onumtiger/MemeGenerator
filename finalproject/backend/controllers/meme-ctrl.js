const Meme = require('../db/models/meme-model');
const User = require('../db/models/user-model');
const MemeStats = require('../db/models/memestats-model');
const TemplateStats = require('../db/models/templatestats-model');
const dbUtils = require('../db/dbUtils');
const globalHelpers = require('../utils/globalHelpers');
const { getTodayString } = require('../utils/globalHelpers');

const createMeme = async(req, res) => { //TODO send template ID, increment template uses on creation
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No meme data received!'
        })
    }

    if (req.files && req.files.image) { //check if we actually received a file
        let img = req.files.image;
        let id = await dbUtils.getNewEmptyMemeID();
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
        body.id = await dbUtils.getNewEmptyMemeID();
        body.url = body.imageURL;
        saveMeme(body, res);

    } else {
        return res.status(400).json({
            success: false,
            error: 'No valid file received!'
        });
    }
}

const saveMeme = (params, res) => {
    const meme = new Meme({
        _id: params.id,
        url: params.url,
        name: params.name,
        user_id: params.userID,
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
        .then(() => {
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

const getMemes = async(req, res) => {
    console.log("Trying to get memes!")
    await Meme.find({}, (err, memes) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // if (!memes.length) {
        //     return res
        //         .status(204)
        //         .json({ success: false, error: `No memes found` })
        // }
        return res.status(200).json({ success: true, data: memes })
    }).catch(err => console.log(err))
}

const patchMeme = async function(req, res) {
    console.log("Patch Meme generic")
    var body = req.body;
    var memeId = req.params.id;
    var updatedProperty = body.toUpdate
    const result = await Meme.updateOne({ _id: memeId }, updatedProperty)
    console.log(result);
}

// adds a SINGLE view to database meme.stats by given id when called
const postViewMeme = async(req, res) => {
    try {
        var memeId = req.params.id;
        // console.log("post views")
        // console.log(req.body)
        let currentMeme = await Meme.findById(memeId);
        // console.log(currentMeme)
        var currentViews = currentMeme.stats.views
            // console.log("current views: ", currentViews)
        updatedViews = currentViews + 1
            // console.log("updated views", updatedViews)
        var date = getTodayString();
        const result = await Meme.updateOne({ _id: memeId }, { 'stats.views': updatedViews })
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

const postUpvotesMeme = async(req, res) => {
    try {
        console.log("post upvotes")
        var body = req.body;
        var memeId = req.params.id;
        var updatedUserId = body.toUpdate;
        var date = getTodayString();
        const result = await Meme.updateOne({ _id: memeId }, { $push: { 'stats.upvotes': updatedUserId } })
        MemeStats.findOneAndUpdate({ _id: memeId, 'days.date': date }, { $inc: { 'days.$.upvotes': 1 } }, async(err, memeStats) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!memeStats) {
                await MemeStats.updateOne({ _id: memeId }, { $push: { 'days': { date: date, upvotes: 1 } } });
            }
            return res.status(200).json({ success: true });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}

const postDownvotesMeme = async(req, res) => {
    try {
        console.log("post downvotes")
        var body = req.body;
        var memeId = req.params.id;
        var updatedUserId = body.toUpdate
        var date = getTodayString();
        const result = await Meme.updateOne({ _id: memeId }, { $push: { 'stats.downvotes': updatedUserId } })
        MemeStats.findOneAndUpdate({ _id: memeId, 'days.date': date }, { $inc: { 'days.$.downvotes': 1 } }, async(err, memeStats) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!memeStats) {
                await MemeStats.updateOne({ _id: memeId }, { $push: { 'days': { date: date, downvotes: 1 } } });
            }
            return res.status(200).json({ success: true });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}


module.exports = {
    createMeme,
    deleteMeme,
    patchMeme,
    postViewMeme,
    postUpvotesMeme,
    postDownvotesMeme,
    getMemes,
    getMemeById
}