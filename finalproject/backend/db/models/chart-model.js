const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChartSchema = new Schema(
  {
    _id: { type: Number, required: true}, // chart id for one meme
    upvotes: { type: [Number], required: false }, // upvotes, max 14 
    downvotes: { type: [Number], required: false }, // upvotes, max 14
    views: { type: [Number], required: false}, // views, max 14
}, { collection: 'charts' }); 


module.exports = mongoose.model('chart', ChartSchema );
