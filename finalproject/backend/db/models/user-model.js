const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    _id: { type: Number, required: true}, // individual user id (not displayed)
    username: { type: String, required: true}, // displayed username 
    password: { type: [String], required: true }, // password for login
    meme_ids: { type: [Number], required: false, default: []}, // user created memes (ID Array)
    template_ids: { type: [Number], required: false, default: []}, // user uploaded memes (ID Array)
    draft_ids: { type: [Number], required: false, default: []} // user uploaded drafts (ID Array)
 }, { collection: 'users' }); 


module.exports = mongoose.model('user', UserSchema );
