const mongoose = require('mongoose')

mongoose
    .connect('mongodb://127.0.0.1:27017/memeApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection


// -- Comment out everything (l.13 - l.59) if you dont want the database to reset --

// mongoose lokal db MEMES reset, without SCHMEMA
db.collection('memes').deleteMany({}).then(function(){ 
    console.log("Old memes deleted") });

var defaultMeme = {
    _id: 0,
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2'], 
    name: 'memeName', 
    stats_id: 0, 
    comment_ids: [0, 1],
    user_id: 0, 
    visibilty: 2,
    creationDate: '12021997'
};

var defaultMeme2 = {
    _id: 1,
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2'], 
    name: 'memeName', 
    stats_id: 1, 
    comment_ids: [2, 3],
    user_id: 1, 
    visibilty: 2,
    creationDate: '12021997'
};

var defaultMeme3 = {
    _id: 2,
    url: 'testURL',
    captions: ['testCaption1', 'testCaption2'], 
    name: 'memeName', 
    stats_id: 2, 
    comment_ids: [3, 4],
    user_id: 0, 
    visibilty: 2,
    creationDate: '12021997'
};

db.collection('memes').insertMany([defaultMeme, defaultMeme2, defaultMeme3]).then(function(){ 
    console.log("Default memes inserted") });


// mongoose lokal db USER reset, without SCHMEMA
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