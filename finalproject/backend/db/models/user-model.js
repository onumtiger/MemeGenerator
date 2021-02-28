const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * User model used in db
 * required attributes are id, email, username and password
 */
const UserSchema = new Schema(
  {
    _id: { type: Number, required: true},
    email: {
      type: String, 
      required: true, 
      unique: true,
      match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    username: { 
      type: String, 
      required: true, 
      unique: true,
      match: /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/
    }, // displayed username 
    password: { type: [String], required: true }, // password for login
    meme_ids: { type: [Number], required: false} // user created memes (Array)
 }, { collection: 'users' }); 


module.exports = mongoose.model('user', UserSchema );
