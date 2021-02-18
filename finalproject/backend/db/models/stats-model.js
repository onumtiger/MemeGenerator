const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatsSchema = new Schema(
  {
    _id: { type: Number, required: true}, // stats id
    upvotes: { type: [Number], default: [] }, // array of user_ids who upvoted this object (this prevents multiple per user)
    downvotes: { type: [Number], default: [] }, // array of user_ids who downvoted this object (this prevents multiple per user)
    views: { type: Number, default: 0}, // views for object (must be public then)
 }, { collection: 'stats' }); 


module.exports = mongoose.model('stat', StatsSchema );
