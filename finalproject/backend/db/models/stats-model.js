const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatsSchema = new Schema(
  {
    _id: { type: Number, required: true}, // stats id
    upvotes: { type: [Number], required: false }, // upvotes for object (must be public then): array of user_ids who upvoted this object (this prevents multiple upvotes per user)
    downvotes: { type: [Number], required: false }, // upvotes for object (must be public then): array of user_ids who upvoted this object (this prevents multiple upvotes per user)
    views: { type: Number, required: false}, // views for object (must be public then)
 }, { collection: 'stats' }); 


module.exports = mongoose.model('stat', StatsSchema );
