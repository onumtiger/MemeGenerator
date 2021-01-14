const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MemeSchema = new Schema(
  {
    id: { type: Number, required: true},
    url: { type: String, required: true},
    captions: { type: [String], required: true },
    box_count: { type: Number, required: false},
    height: { type: Number, required: false},
    width: { type: Number, required: false},
    name: { type: String, required: false},
    runtime: { type: Number, required: false},
    comments: { type: [String], required: false },
    votes: { type: Number, required: false },
    views: { type: Number, required: false},
    creationDate: { type: String, required: false}
 }); 


module.exports = mongoose.model('Meme', MemeSchema );
