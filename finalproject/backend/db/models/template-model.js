const mongoose = require('mongoose');
const constants = require('../../utils/constants');
const Schema = mongoose.Schema;

// MODEL FOR A TEMPLATE
const TemplateSchema = new Schema(
  {
    _id: { type: Number, required: true }, //template ID
    url: { type: String, required: true }, //template image URL
    name: { type: String, required: true }, //template name / short description
    user_id: { type: Number, required: true }, //uploader of this template - reference user DB instance by ID or similar
    visibility: { type: Number, required: true, default: constants.VISIBILITY.PUBLIC }, //visibility of this template: private / public - possible values in constants.js
    stats: { //for public templates
      upvotes: { type: [Number], required: false, default: [] }, // array of user_ids who upvoted this template (this prevents multiple upvotes per user)
      downvotes: { type: [Number], required: false, default: [] }, // array of user_ids who upvoted this template (this prevents multiple upvotes per user)
      uses: { type: Number, required: false, default: 0 }, // number of meme generations with this template
    }
  }, { collection: 'templates' }); // templates collection

module.exports = mongoose.model('template', TemplateSchema);
