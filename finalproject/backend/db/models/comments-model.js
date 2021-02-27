const mongoose = require('mongoose');
const globalHelpers = require('../../utils/globalHelpers');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    _id: { type: Number, required: true}, // comment id
    user_id: { type: Number, required: true }, // user_id for comment author
    message: { type: String, required: true }, // comment text
    creationDate: { type: String, required: true, default: globalHelpers.getTodayString()}, // comment publishing date
 }, { collection: 'comments' });


module.exports = mongoose.model('comment', CommentSchema );
