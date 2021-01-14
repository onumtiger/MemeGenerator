const mongoose = require('mongoose')



mongoose
    .connect('mongodb://127.0.0.1:27017/memes', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection


// mongoose lokal db reset 
db.collection('memes').deleteMany({}).then(function(){ 
    console.log("Old memes deleted") });


var defaultMeme = {
    id: '0',
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2']
};

var defaultMeme2 = {
    id: '1',
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2']
};

var defaultMeme3 = {
    id: '2',
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2']
};

db.collection('memes').insertMany([defaultMeme, defaultMeme2, defaultMeme3]).then(function(){ 
    console.log("Default memes inserted") });

module.exports = db