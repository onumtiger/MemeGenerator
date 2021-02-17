const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    _id: { type: Number, required: true}, // comment id
    user_id: { type: [String], required: true }, // user_id for comment author
    message: { type: String, required: true }, // comment text
    creationDate: { type: String, required: true}, // comment publishing date
 }, { collection: 'comments' }); 


module.exports = mongoose.model('comment', CommentSchema );
