const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DraftSchema = new Schema(
  {
    _id: { type: Number, required: true}, // draft id
    template_src: { type: String, required: true}, // template image src
    title: { type: String, required: true}, //meme title
    captions: [{
        x: { type: Number, required: true}, //x coord
        y: { type: Number, required: true}, //y coord
        text: { type: String, required: true}, //caption text
        fontSize: { type: Number, required: true, default: 60}, //font size (px), default matching the frontend default
        colorR: { type: Number, required: true, default: 255}, //font color red component, default matching the frontend default
        colorG: { type: Number, required: true, default: 255}, //font color green component, default matching the frontend default
        colorB: { type: Number, required: true, default: 255}, //font color blue component, default matching the frontend default
        bold: { type: Boolean, required: true, default: false }, //bold font
        italic: { type: Boolean, required: true, default: false }, //italic font
        fontFace: { type: String, required: true, default: "Impact"} //font face, default matching the frontend default
    }]
 }, { collection: 'drafts' });


module.exports = mongoose.model('draft', DraftSchema );
