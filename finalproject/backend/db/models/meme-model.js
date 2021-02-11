const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MemeSchema = new Schema(
  {
    _id: { type: Number, required: true}, // meme id
    url: { type: String, required: true}, // url where final meme is stored
    captions: { type: [String], required: true }, // captions array
    box_count: { type: Number, required: false}, // 
    height: { type: Number, required: false}, // height of the meme
    width: { type: Number, required: false}, // width of the meme
    name: { type: String, required: false}, // name of the meme (for searching later on)
    runtime: { type: Number, required: false}, // 
    comments: { type: [String], required: false }, // comments added to meme (must be public then)
    votes: { type: Number, required: false }, // upvotes for meme (must be public then)
    views: { type: Number, required: false}, // view for meme (must be public then)
    creationDate: { type: String, required: false}, // date of creation
    public: {type: Boolean, required: true} // if user sets his meme to public -> true
 }, { collection: 'memes' }); 


module.exports = mongoose.model('meme', MemeSchema );
