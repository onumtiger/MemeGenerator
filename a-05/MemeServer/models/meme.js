const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is a schema, only one file per schema! 
/*const MemeSchema = new Schema(
  {
    code: Number,
    url: String,
    title: String,
    title2: String,
    title3: String,
    voting: Number,
    comments: Number,
    runtime: Number
 });*/
 const MemeSchema = new Schema(
    {
        memeURLs: {           
            'type': {type: String},
            'value': [String]
            },
    }); 


module.exports = mongoose.model('meme', MemeSchema );