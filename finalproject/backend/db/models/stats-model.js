const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatsSchema = new Schema(
  {
    _id: { type: Number, required: true}, // stats id
    comments: { type: [String], required: false }, // comments added to object (must be public then)
    votes: { type: Number, required: false }, // upvotes for object (must be public then)
    views: { type: Number, required: false}, // views for obejct (must be public then)
 }, { collection: 'stats' }); 


module.exports = mongoose.model('stat', StatsSchema );
