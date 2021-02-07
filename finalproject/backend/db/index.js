const mongoose = require('mongoose')

mongoose
    .connect('mongodb://127.0.0.1:27017/memes', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection


// mongoose lokal db MEMES reset 
db.collection('memes').deleteMany({}).then(function(){ 
    console.log("Old memes deleted") });

var defaultMeme = {
    _id: '0',
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2']
};

var defaultMeme2 = {
    _id: '1',
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2']
};

var defaultMeme3 = {
    _id: '2',
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2']
};

db.collection('memes').insertMany([defaultMeme, defaultMeme2, defaultMeme3]).then(function(){ 
    console.log("Default memes inserted") });


// mongoose lokal db USER reset
db.collection('users').deleteMany({}).then(function(){ 
    console.log("Old users deleted") });

var defaultUser = {
        _id: '0',
        url: 'username_one',
        password: '123',
        meme_ids: ['0', '1']
};

var defaultUser2 = {
        _id: '1',
        url: 'username_two',
        password: '123', 
        meme_ids: ['2']
}

db.collection('users').insertMany([defaultUser, defaultUser2]).then(function(){ 
    console.log("Default users inserted") });


module.exports = db