const mongoose = require('mongoose');

mongoose
    .connect('mongodb://127.0.0.1:27017/memeApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    });

const db = mongoose.connection;

const resetDB = async ()=>{
    //reset the DB, for every collection making sure the old entries are gone before we save new ones with possibly colliding IDs
    
    // mongoose lokal db MEMES reset, without SCHMEMA
    await db.collection('memes').deleteMany({});
    console.log("Old memes deleted");
    
    var defaultMeme = {
        _id: 0,
        url: '/memes/jan_domi_zusammentreffen.png',
        captions: ['Domi', 'Jan Jbernolte'],
        name: 'Jan und Domi unterwegs',
        stats_id: 0,
        comment_ids: [0, 1],
        user_id: 0,
        visibilty: 2,
        creationDate: "2021-02-12",
        stats: {
            upvotes: [0, 2, 3],
            downvotes: [1],
            views: 230
        }
    };

    var defaultMeme2 = {
        _id: 1,
        url: '/memes/jan_domi_punch.png',
        captions: ['Domi', 'Jan Obernolte'],
        name: 'Jan und Domis Gefühle füreinander <3',
        stats_id: 1,
        comment_ids: [2, 3],
        user_id: 1,
        visibilty: 2,
        creationDate: "2021-02-13",
        stats: {
            upvotes: [0],
            downvotes: [1, 2, 3],
            views: 160
        }
    };

    var defaultMeme3 = {
        _id: 2,
        url: '/memes/jan_domi_cat.jpg',
        captions: ['Dominik', 'Jan Obernolte'],
        name: 'Jan als Katze',
        stats_id: 2,
        comment_ids: [4, 5],
        user_id: 2,
        visibilty: 2,
        creationDate: "2021-02-14",
        stats: {
            upvotes: [0, 3],
            downvotes: [1, 2],
            views: 90
        }
    };

    await db.collection('memes').insertMany([defaultMeme, defaultMeme2, defaultMeme3]);
    console.log("Default memes inserted");


    // mongoose lokal db USER reset, without SCHMEMA
    await db.collection('users').deleteMany({});
    console.log("Old users deleted");

    var defaultUser = {
        _id: 0,
        url: 'username_one',
        password: '123',
        meme_ids: ['0', '1']
    };
    
    var defaultUser2 = {
        _id: 1,
        url: 'username_two',
        password: '123',
        meme_ids: ['2']
    };
    
    await db.collection('users').insertMany([defaultUser, defaultUser2]);
    console.log("Default users inserted");


    // mongoose lokal db Comment insert/reset, without SCHMEMA
    await db.collection('comments').deleteMany({});
    console.log("Old comments deleted");

    var defaultComment = {
        _id: 0,
        user_id: 0,
        message: 'Richtig unlustiges Meme',
        creationDate: '12.02.2021'
    };

    var defaultComment2 = {
        _id: 1,
        user_id: 1,
        message: 'Wow, gar nicht lustig - wirklich 0 lustig ..',
        creationDate: '12.02.2021'
    };

    await db.collection('comments').insertMany([defaultComment, defaultComment2]);
    console.log("Default comments inserted");
    

    // mongoose lokal db Chart insert/reset, without SCHMEMA
    await db.collection('charts').deleteMany({});
    console.log("Old charts deleted");

    var defaultChart = {
        _id: 0,
        upvotes: [20, 45, 33, 67, 54, 24, 25, 35, 64, 35, 23, 14, 53, 45],
        downvotes: [2, 4, 3, 7, 4, 4, 5, 3, 4, 3, 3, 1, 3, 5],
        views: [300, 412, 456, 234, 345, 765, 345, 123, 234, 345, 234, 123, 567, 345]
    };


    await db.collection('charts').insertMany([defaultChart]);
    console.log("Default charts inserted");
}

//comment this line out if you don't want the DB to reset
resetDB();

module.exports = db;