const Template = require('../db/models/template-model');
const Meme = require('../db/models/meme-model');
const Stats = require('../db/models/stats-model');

module.exports = {
    getTodayString: ()=>{
        let d = new Date();
        let day = `${d.getDate()}`.padStart(2, '0');
        let month = `${d.getMonth()+1}`.padStart(2, '0');
        let year = d.getFullYear();
        return `${day}/${month}/${year}`; //form: dd/mm/yyyy
    },
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