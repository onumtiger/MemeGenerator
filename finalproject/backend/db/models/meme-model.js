const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MemeSchema = new Schema(
  {
    _id: { type: Number, required: true}, // meme id
    url: { type: String, required: true}, // url where final meme is stored
    captions: { type: [String], required: true }, // captions array
    name: { type: String, required: true}, // name of the meme (for searching later on)
    stats_id: { type: Number, required: true }, // stats id -> linked meme statistics 
    user_id: { type: Number, required: true }, // user id -> who created meme
    public: {type: Number, required: true}, // user sets his meme to public (2), not listed (1), private (0)
    creationDate: { type: String, required: false} // date of creation
 }, { collection: 'memes' }); 


module.exports = mongoose.model('meme', MemeSchema );
