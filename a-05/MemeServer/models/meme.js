const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is a schema, only one file per schema! 
const MemeSchema = new Schema(
  {
    id: Number,
    box_count: Number,
    height: Number,
    width: Number,
    url: String,
    name: String,
    captions: {
      'type': {type: String},
      'value': [String]
    },
    runtime: Number
 }); //comments, voting, stats tbd

//  const MemeSchema = new Schema(
//     {
//         memeURLs: {           
//             'type': {type: String},
//             'value': [String]
//             }
//     },
//     { collection : 'memes' });


module.exports = mongoose.model('meme', MemeSchema );