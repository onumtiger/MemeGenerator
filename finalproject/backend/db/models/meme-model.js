const mongoose = require('mongoose');
const constants = require('../../utils/constants');
const globalHelpers = require('../../utils/globalHelpers');
const Schema = mongoose.Schema;

const MemeSchema = new Schema({
    _id: { type: Number, required: true }, // meme id
    url: { type: String, required: true }, // url where final meme is stored
    captions: { type: [String], required: true }, // captions array
    name: { type: String, required: true }, // name of the meme (for searching later on)
    stats_id: { type: Number, required: true }, // stats id -> linked meme statistics 
    comment_ids: { type: [Number], required: true, default: [] }, // comment_ids for comments added to the meme (must be public then)
    user_id: { type: Number, required: true }, // user id -> who created meme
    visibility: {type: Number, required: true, default: constants.VISIBILITY_PUBLIC}, // visibility of the meme: public / unlisted / private - possible values in constants.js
    creationDate: { type: String, required: false, default: globalHelpers.getTodayString()} // date of creation
 }, { collection: 'memes' });

module.exports = mongoose.model('meme', MemeSchema);
