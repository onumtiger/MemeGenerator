const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MemeSchema = new Schema({
    _id: { type: Number, required: true }, // meme id
    url: { type: String, required: true }, // url where final meme is stored
    captions: { type: [String], required: true }, // captions array
    name: { type: String, required: true }, // name of the meme (for searching later on)
    comment_ids: { type: [Number], required: true }, // comment_ids for comments added to the meme (must be public then)
    user_id: { type: Number, required: true }, // user id -> who created meme
    visibility: { type: Number, required: true }, // user sets his meme to public (2), not listed (1), private (0)
    creationDate: { type: String, required: false }, // date of creation
    stats: {
        upvotes: { type: [Number], required: false }, // upvotes for object (must be public then): array of user_ids who upvoted this object (this prevents multiple upvotes per user)
        downvotes: { type: [Number], required: false }, // upvotes for object (must be public then): array of user_ids who upvoted this object (this prevents multiple upvotes per user)
        views: { type: Number, required: false}, // views for object (must be public then)}
    }
}, { collection: 'memes' });



module.exports = mongoose.model('meme', MemeSchema);