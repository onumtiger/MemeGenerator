const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatsSchema = new Schema(
  {
    _id: { type: Number, required: true}, // meme id
    comments: { type: [String], required: false }, // comments added to meme (must be public then)
    votes: { type: Number, required: false }, // upvotes for meme (must be public then)
    views: { type: Number, required: false}, // view for meme (must be public then)
 }, { collection: 'stats' }); 


module.exports = mongoose.model('stat', StatsSchema );
