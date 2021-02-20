const Template = require('./models/template-model');
const Meme = require('./models/meme-model');
const Stats = require('./models/stats-model');

module.exports = {
    getNewEmptyTemplateID: async ()=>{
        let prevTemplates = await Template.find({});
        let id = prevTemplates.length;
        return id;
    },
    getNewEmptyMemeID: async ()=>{
        let prevMemes = await Meme.find({});
        let id = prevMemes.length;
        return id;
    },
    getNewFullStatsID: async ()=>{
        let prevStats = await Stats.find({});
        let id = prevStats.length;

        const newStats = new Stats({
            _id: id,
            upvotes: [],
            downvotes: [],
            views: 0
        });
        await newStats.save();

        return id;
    }
}