const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TemplateSchema = new Schema(
  {
    id: { type: Number, required: true}, //template ID
    url: { type: String, required: true}, //template image URL
    name: { type: String, required: true}, //template name / short description
    uploader: { type: String, required: true}, //uploader of this template - TODO reference user DB instance by ID or similar
    visibility: { type: Number, required: true}, //visibility of this template: 0 (private) or 1 (public) [2 (unlisted) does not make much sense for templates ]
    numUsed: { type: Number, required: false} //number of uses of this templates to create a meme - TODO replace with reference to (Template)Stats DB instance by ID
 });


module.exports = mongoose.model('template', TemplateSchema );
