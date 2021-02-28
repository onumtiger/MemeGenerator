const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MODEL FOR STATS (MEME) 
const MemeStatsSchema = new Schema({
    _id: { type: Number, required: true }, // matching MEME (!) id
    days: [{
        date: { type: String, required: true },
        upvotes: { type: Number, default: 0 }, // number of upvotes on this day
        downvotes: { type: Number, default: 0 }, // number of downvotes on this day
        views: { type: Number, default: 0 } // number of views on this day
    }],
}, { collection: 'memestats' }); // collection memeStats


module.exports = mongoose.model('memestats', MemeStatsSchema);