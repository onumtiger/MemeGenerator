const mongoose = require('mongoose');

mongoose
    .connect('mongodb://127.0.0.1:27017/memeApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    });

const db = mongoose.connection;

const resetDB = async() => {
    //reset the DB, for every collection making sure the old entries are gone before we save new ones with possibly colliding IDs

    // mongoose lokal db MEMES reset, without SCHMEMA
    await db.collection('memes').deleteMany({});
    console.log("Old memes deleted");

    var defaultMeme = {
        _id: 0,
        url: '/memes/jan_domi_zusammentreffen.png',
        captions: ['Domi', 'Jan Jbernolte'],
        name: 'Jan und Domi unterwegs',
        comment_ids: [0, 1],
        user_id: 0,
        visibility: 2,
        creationDate: "2021/02/12",
        stats: {
            upvotes: [0, 2, 3],
            downvotes: [1],
            views: 0
        }
    };

    var defaultMeme2 = {
        _id: 1,
        url: '/memes/jan_domi_punch.png',
        captions: ['Domi', 'Jan Obernolte'],
        name: 'Jan und Domis Gefühle füreinander <3',
        comment_ids: [2, 3],
        user_id: 1,
        visibility: 2,
        creationDate: "2021/02/13",
        stats: {
            upvotes: [0],
            downvotes: [1, 2, 3],
            views: 0
        }
    };

    var defaultMeme3 = {
        _id: 2,
        url: '/memes/jan_domi_cat.jpg',
        captions: ['Dominik', 'Jan Obernolte'],
        name: 'Jan als Katze',
        comment_ids: [4, 5],
        user_id: 2,
        visibility: 2,
        creationDate: "2021/02/14",
        stats: {
            upvotes: [0, 3],
            downvotes: [1, 2],
            views: 0
        }
    };

    await db.collection('memes').insertMany([defaultMeme, defaultMeme2, defaultMeme3]);
    console.log("Default memes inserted");

    await db.collection('templates').deleteMany({});
    console.log("Old templates deleted");
    
    var defaultTemplate = {
        _id: 0,
        url: '/templates/Bernie-I-Am-Once-Again-Asking-For-Your-Support.jpg',
        name: 'Bernie I Am Once Again Asking For Your Support',
        user_id: 0,
        visibility: 2,
        stats: {
            upvotes: [0, 2, 3],
            downvotes: [1],
            uses: 0
        }
    };

    var defaultTemplate2 = {
        _id: 1,
        url: '/templates/button-decision.png',
        name: 'Two Buttons',
        user_id: 1,
        visibility: 2,
        stats: {
            upvotes: [0],
            downvotes: [1, 2, 3],
            uses: 0
        }
    };

    var defaultTemplate3 = {
        _id: 2,
        url: '/templates/Change-my-mind.png',
        name: 'Change My Mind Guy',
        user_id: 2,
        visibility: 2,
        stats: {
            upvotes: [0, 3],
            downvotes: [1, 2],
            uses: 0
        }
    };

    var defaultTemplate4 = {
        _id: 3,
        url: '/templates/Drake.jpg',
        name: 'Drake Hotline Bling',
        user_id: 0,
        visibility: 2,
        stats: {
            upvotes: [],
            downvotes: [],
            uses: 0
        }
    };

    var defaultTemplate5 = {
        _id: 4,
        url: '/templates/Left-Exit-12-Off-Ramp.jpg',
        name: 'Left Exit 12 Off Ramp',
        user_id: 0,
        visibility: 2,
        stats: {
            upvotes: [],
            downvotes: [],
            uses: 0
        }
    };

    var defaultTemplate6 = {
        _id: 5,
        url: '/templates/Mittens-Bernie.jpg',
        name: 'Mittens Bernie',
        user_id: 0,
        visibility: 2,
        stats: {
            upvotes: [],
            downvotes: [],
            uses: 0
        }
    };

    var defaultTemplate7 = {
        _id: 6,
        url: '/templates/The-Rock-Driving.jpg',
        name: 'The Rock Driving',
        user_id: 0,
        visibility: 2,
        stats: {
            upvotes: [],
            downvotes: [],
            uses: 0
        }
    };

    var defaultTemplate8 = {
        _id: 7,
        url: '/templates/Woman-Yelling-at-Cat.png',
        name: 'Woman Yelling at Cat',
        user_id: 0,
        visibility: 2,
        stats: {
            upvotes: [],
            downvotes: [],
            uses: 0
        }
    };

    await db.collection('templates').insertMany([defaultTemplate, defaultTemplate2, defaultTemplate3, defaultTemplate4, defaultTemplate5, defaultTemplate6, defaultTemplate7, defaultTemplate8]);
    console.log("Default templates inserted");

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
        creationDate: '2021/02/12'
    };

    var defaultComment2 = {
        _id: 1,
        user_id: 1,
        message: 'Wow, gar nicht lustig - wirklich 0 lustig ..',
        creationDate: '2021/02/12'
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


    // mongoose lokal db MemeStats insert/reset, without SCHMEMA
    await db.collection('memestats').deleteMany({});
    console.log("Old memestats deleted");

    var defaultMemeStats = {
        _id: 0,
        days: [{
                date: "2021/02/09",
                upvotes: 20,
                downvotes: 2,
                views: 30
            },
            {
                date: "2021/02/10",
                upvotes: 45,
                downvotes: 4,
                views: 51
            },
            {
                date: "2021/02/11",
                upvotes: 33,
                downvotes: 3,
                views: 45
            },
            {
                date: "2021/02/12",
                upvotes: 67,
                downvotes: 7,
                views: 83
            },
            {
                date: "2021/02/13",
                upvotes: 54,
                downvotes: 4,
                views: 64
            },
            {
                date: "2021/02/14",
                upvotes: 24,
                downvotes: 4,
                views: 76
            },
            {
                date: "2021/02/15",
                upvotes: 25,
                downvotes: 5,
                views: 34
            },
            {
                date: "2021/02/16",
                upvotes: 35,
                downvotes: 3,
                views: 42
            },
            {
                date: "2021/02/17",
                upvotes: 64,
                downvotes: 4,
                views: 70
            },
            {
                date: "2021/02/18",
                upvotes: 35,
                downvotes: 3,
                views: 39
            },
            {
                date: "2021/02/19",
                upvotes: 23,
                downvotes: 3,
                views: 28
            },
            {
                date: "2021/02/20",
                upvotes: 14,
                downvotes: 1,
                views: 19
            },
            {
                date: "2021/02/21",
                upvotes: 53,
                downvotes: 3,
                views: 56
            },
            {
                date: "2021/02/22",
                upvotes: 45,
                downvotes: 5,
                views: 54
            }
        ]
    };

    var defaultMemeStats2 = {
        _id: 1,
        days: [{
                date: "2021/02/09",
                upvotes: 6,
                downvotes: 1,
                views: 19
            },
            {
                date: "2021/02/10",
                upvotes: 10,
                downvotes: 0,
                views: 18
            },
            {
                date: "2021/02/11",
                upvotes: 9,
                downvotes: 2,
                views: 17
            },
            {
                date: "2021/02/12",
                upvotes: 7,
                downvotes: 6,
                views: 21
            },
            {
                date: "2021/02/13",
                upvotes: 2,
                downvotes: 1,
                views: 20
            },
            {
                date: "2021/02/14",
                upvotes: 8,
                downvotes: 2,
                views: 27
            },
            {
                date: "2021/02/15",
                upvotes: 9,
                downvotes: 3,
                views: 28
            },
            {
                date: "2021/02/16",
                upvotes: 14,
                downvotes: 5,
                views: 25
            },
            {
                date: "2021/02/17",
                upvotes: 18,
                downvotes: 0,
                views: 24
            },
            {
                date: "2021/02/18",
                upvotes: 13,
                downvotes: 1,
                views: 23
            },
            {
                date: "2021/02/19",
                upvotes: 19,
                downvotes: 1,
                views: 26
            },
            {
                date: "2021/02/20",
                upvotes: 23,
                downvotes: 4,
                views: 29
            },
            {
                date: "2021/02/21",
                upvotes: 15,
                downvotes: 2,
                views: 23
            },
            {
                date: "2021/02/22",
                upvotes: 12,
                downvotes: 3,
                views: 20
            }
        ]
    };

    var defaultMemeStats3 = {
        _id: 2,
        days: [{
                date: "2021/02/09",
                upvotes: 6,
                downvotes: 1,
                views: 19
            },
            {
                date: "2021/02/10",
                upvotes: 10,
                downvotes: 0,
                views: 18
            },
            {
                date: "2021/02/11",
                upvotes: 9,
                downvotes: 2,
                views: 17
            },
            {
                date: "2021/02/12",
                upvotes: 7,
                downvotes: 6,
                views: 21
            },
            {
                date: "2021/02/13",
                upvotes: 2,
                downvotes: 1,
                views: 20
            },
            {
                date: "2021/02/14",
                upvotes: 8,
                downvotes: 2,
                views: 27
            },
            {
                date: "2021/02/15",
                upvotes: 9,
                downvotes: 3,
                views: 28
            },
            {
                date: "2021/02/16",
                upvotes: 14,
                downvotes: 5,
                views: 25
            },
            {
                date: "2021/02/17",
                upvotes: 18,
                downvotes: 0,
                views: 24
            },
            {
                date: "2021/02/18",
                upvotes: 13,
                downvotes: 1,
                views: 23
            },
            {
                date: "2021/02/19",
                upvotes: 19,
                downvotes: 1,
                views: 26
            },
            {
                date: "2021/02/20",
                upvotes: 23,
                downvotes: 4,
                views: 29
            },
            {
                date: "2021/02/21",
                upvotes: 15,
                downvotes: 2,
                views: 23
            },
            {
                date: "2021/02/22",
                upvotes: 12,
                downvotes: 3,
                views: 20
            }
        ]
    };

    await db.collection('memestats').insertMany([defaultMemeStats, defaultMemeStats2, defaultMemeStats3]);
    console.log("Default memestats inserted");


    // mongoose lokal db MemeStats insert/reset, without SCHMEMA
    await db.collection('templatestats').deleteMany({});
    console.log("Old templatestats deleted");

    var defaultTemplateStats = {
        _id: 0,
        days: [{
                date: "2021/02/09",
                upvotes: 10,
                downvotes: 2,
                uses: 12
            },
            {
                date: "2021/02/10",
                upvotes: 7,
                downvotes: 4,
                uses: 13
            },
            {
                date: "2021/02/11",
                upvotes: 8,
                downvotes: 3,
                uses: 12
            },
            {
                date: "2021/02/12",
                upvotes: 14,
                downvotes: 7,
                uses: 6
            },
            {
                date: "2021/02/13",
                upvotes: 20,
                downvotes: 4,
                uses: 8
            },
            {
                date: "2021/02/14",
                upvotes: 17,
                downvotes: 4,
                uses: 9
            },
            {
                date: "2021/02/15",
                upvotes: 13,
                downvotes: 5,
                uses: 9
            },
            {
                date: "2021/02/16",
                upvotes: 15,
                downvotes: 3,
                uses: 15
            },
            {
                date: "2021/02/17",
                upvotes: 20,
                downvotes: 4,
                uses: 19
            },
            {
                date: "2021/02/18",
                upvotes: 27,
                downvotes: 3,
                uses: 28
            },
            {
                date: "2021/02/19",
                upvotes: 32,
                downvotes: 3,
                uses: 36
            },
            {
                date: "2021/02/20",
                upvotes: 34,
                downvotes: 1,
                uses: 39
            },
            {
                date: "2021/02/21",
                upvotes: 37,
                downvotes: 3,
                uses: 40
            },
            {
                date: "2021/02/22",
                upvotes: 45,
                downvotes: 5,
                uses: 54
            }
        ]
    }

    var defaultTemplateStats2 = {
        _id: 1,
        days: [{
                date: "2021/02/09",
                upvotes: 44,
                downvotes: 2,
                uses: 53
            },
            {
                date: "2021/02/10",
                upvotes: 40,
                downvotes: 4,
                uses: 50
            },
            {
                date: "2021/02/11",
                upvotes: 37,
                downvotes: 3,
                uses: 48
            },
            {
                date: "2021/02/12",
                upvotes: 30,
                downvotes: 7,
                uses: 32
            },
            {
                date: "2021/02/13",
                upvotes: 29,
                downvotes: 4,
                uses: 30
            },
            {
                date: "2021/02/14",
                upvotes: 23,
                downvotes: 4,
                uses: 27
            },
            {
                date: "2021/02/15",
                upvotes: 20,
                downvotes: 5,
                uses: 25
            },
            {
                date: "2021/02/16",
                upvotes: 18,
                downvotes: 3,
                uses: 21
            },
            {
                date: "2021/02/17",
                upvotes: 15,
                downvotes: 4,
                uses: 19
            },
            {
                date: "2021/02/18",
                upvotes: 14,
                downvotes: 3,
                uses: 15
            },
            {
                date: "2021/02/19",
                upvotes: 17,
                downvotes: 3,
                uses: 14
            },
            {
                date: "2021/02/20",
                upvotes: 12,
                downvotes: 1,
                uses: 12
            },
            {
                date: "2021/02/21",
                upvotes: 9,
                downvotes: 3,
                uses: 10
            },
            {
                date: "2021/02/22",
                upvotes: 3,
                downvotes: 5,
                uses: 6
            }
        ]
    }

    await db.collection('templatestats').insertMany([defaultTemplateStats, defaultTemplateStats2]);
    console.log("Default templatestats inserted");
}

//comment this line out if you don't want the DB to reset
resetDB();

module.exports = db;