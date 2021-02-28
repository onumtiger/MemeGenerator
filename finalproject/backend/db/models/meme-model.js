const mongoose = require('mongoose');
const constants = require('../../utils/constants');
const globalHelpers = require('../../utils/globalHelpers');
const Schema = mongoose.Schema;

// MODEL FOR A MEME ENTRY
const MemeSchema = new Schema({
    _id: { type: Number, required: true }, // meme id
    url: { type: String, required: true }, // url where final meme is stored
    captions: { type: [String], required: true }, // captions array
    name: { type: String, required: true }, // name of the meme (for searching later on)
    comment_ids: { type: [Number], required: true, default: [] }, // comment_ids for comments added to the meme (must be public then)
    user_id: { type: Number, required: true }, // user id -> who created meme
    template_id: { type: Number, required: true }, // id of the template used to create this meme
    visibility: { type: Number, required: true, default: constants.VISIBILITY.PUBLIC }, // visibility of the meme: public / unlisted / private - possible values in constants.js
    creationDate: { type: String, required: false, default: globalHelpers.getTodayString() }, // date of creation
    stats: { //for public memes
        upvotes: { type: [Number], required: false, default: [] }, // array of user_ids who upvoted this meme (this prevents multiple upvotes per user)
        downvotes: { type: [Number], required: false, default: [] }, // array of user_ids who upvoted this meme (this prevents multiple upvotes per user)
        views: { type: Number, required: false, default: 0 }, // number of views for this meme
    }
}, { collection: 'memes' }); // memes collection

module.exports = mongoose.model('meme', MemeSchema);
