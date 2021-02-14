const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TemplateSchema = new Schema(
  {
    _id: { type: Number, required: true}, //template ID
    url: { type: String, required: true}, //template image URL
    name: { type: String, required: true}, //template name / short description
    uploader_id: { type: Number, required: true}, //uploader of this template - reference user DB instance by ID or similar
    visibility: { type: Number, required: true}, //visibility of this template: 0 (private) or 1 (public) [2 (unlisted) does not make much sense for templates ]
    stats_id: { type: Number, required: false} //reference to (Template)Stats DB instance by ID
 }, { collection: 'templates' });


module.exports = mongoose.model('template', TemplateSchema );
