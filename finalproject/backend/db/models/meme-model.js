const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*const MemeSchema = new Schema(
  {
    _id: { type: Number, required: true}, // meme id
    url: { type: String, required: true}, // url where final meme is stored
    captions: { type: [String], required: true }, // captions array
    name: { type: String, required: true}, // name of the meme (for searching later on)
    stats_id: { type: Number, required: true }, // stats id -> linked meme statistics 
    comment_ids: { type: [Number], required: true }, // comment_ids for comments added to the meme (must be public then)
    user_id: { type: Number, required: true }, // user id -> who created meme
    visibility: {type: Number, required: true}, // user sets his meme to public (2), not listed (1), private (0)
    creationDate: { type: String, required: false} // date of creation
 }, { collection: 'memes' }); */

//TESTING SCHEMA
 const MemeSchema = new Schema(
  {
    _id: { type: Number, required: true}, // meme id
    url: { type: String, required: true}, // url where final meme is stored
    captions: { type: [String], required: true }, // captions array
    name: { type: String, required: false}, // name of the meme (for searching later on)
    stats_id: { type: Number, required: false }, // stats id -> linked meme statistics 
    comment_ids: { type: [Number], required: false }, // comment_ids for comments added to the meme (must be public then)
    user_id: { type: Number, required: false }, // user id -> who created meme
    visibility: {type: Number, required: false}, // user sets his meme to public (2), not listed (1), private (0)
    creationDate: { type: String, required: false} // date of creation
 }, { collection: 'memes' }); 


module.exports = mongoose.model('meme', MemeSchema );
