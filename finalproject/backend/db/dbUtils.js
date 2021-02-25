const Template = require('./models/template-model');
const Meme = require('./models/meme-model');
const Draft = require('./models/draft-model');

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
    getNewEmptyDraftID: async ()=>{
        let prevDrafts = await Draft.find({});
        let id = prevDrafts.length;
        return id;
    }
}