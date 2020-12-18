const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is a schema, only one file per schema! 
const MemeSchema = new Schema(
  {
    code: Number,
    title: String,
    artist: String,
    album: String,
    runtime: Number
 });

module.exports = mongoose.model('meme', MemeSchema );