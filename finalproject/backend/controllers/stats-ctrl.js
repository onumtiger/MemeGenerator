const MemeStats = require('../db/models/memestats-model');
const TemplateStats = require('../db/models/templatestats-model');

/**
 * Gets all stats for a specific meme by id
 * @param {*} req 
 * @param {*} res 
 */
const getStatsForMeme = async (req, res) => {
    let memeId = req.params.id;
    await MemeStats.findOne({ _id: memeId }, (err, stats) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!stats) {
            return res
                .status(404)
                .json({ success: false, error: "Could not retrieve statistics for this meme!" })
        }
        return res.status(200).json({ success: true, data: stats });
    }).catch(err => console.log(err))
}

/**
 * Gets stats for a specific template by id
 * @param {*} req 
 * @param {*} res 
 */
const getStatsForTemplate = async (req, res) => {
    let templateId = req.params.id;
    await TemplateStats.findOne({ _id: templateId }, (err, stats) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!stats) {
            return res
                .status(404)
                .json({ success: false, error: "Could not retrieve statistics for this template!" })
        }
        return res.status(200).json({ success: true, data: stats });
    }).catch(err => console.log(err))
}

module.exports = {
    getStatsForMeme,
    getStatsForTemplate
}