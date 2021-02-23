const Template = require('./models/template-model');
const Meme = require('./models/meme-model');

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
    }
}