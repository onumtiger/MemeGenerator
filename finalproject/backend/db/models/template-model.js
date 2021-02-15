const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TemplateSchema = new Schema(
  {
    _id: { type: Number, required: true}, //template ID
    url: { type: String, required: true}, //template image URL
    name: { type: String, required: true}, //template name / short description
    user_id: { type: Number, required: true}, //uploader of this template - reference user DB instance by ID or similar
    visibility: { type: Number, required: true}, //visibility of this template: private / public - possible values in constants.js
    stats_id: { type: Number, required: true} //reference to (Template)Stats DB instance by ID
 }, { collection: 'templates' });


module.exports = mongoose.model('template', TemplateSchema );
