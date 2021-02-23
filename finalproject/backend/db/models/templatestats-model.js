const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateStatsSchema = new Schema(
  {
    _id: { type: Number, required: true}, // matching TEMPLATE (!) id
    days: [{
      date: { type: String, required: true },
      upvotes: { type: Number, default: 0 }, // number of upvotes on this day
      downvotes: { type: Number, default: 0 }, // number of downvotes on this day
      uses: { type: Number, default: 0} // number of uses on this day
    }],
 }, { collection: 'templatestats' });


module.exports = mongoose.model('templatestat', TemplateStatsSchema );
