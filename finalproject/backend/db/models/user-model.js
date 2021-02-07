const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    _id: { type: Number, required: true}, // individual user id (not displayed)
    username: { type: String, required: true}, // displayed username 
    password: { type: [String], required: true }, // password for login
    meme_id: { type: [Number], required: false} // user created memes (Array)
 }); 


module.exports = mongoose.model('User', UserSchema );
