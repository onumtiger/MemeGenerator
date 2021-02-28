const mongoose = require('mongoose');
const IDManager = require('./id-manager');

/**
 * Connection to database 
 */
mongoose
    .connect('mongodb://127.0.0.1:27017/memeApp', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .catch(e => {
        console.error('Connection error', e.message)
    });

const db = mongoose.connection;

const resetDB = async() => {
    //reset the DB, for every collection making sure the old entries are gone before we save new ones with possibly colliding IDs

    //reset our ID manager
    IDManager.reset();

    // mongoose lokal db MEMES reset, without SCHMEMA
    await db.collection('memes').deleteMany({});
    console.log("Old memes deleted");

    var defaultMeme = {
        _id: 0,
        url: '/memes/4_Andreas.png',
        captions: ['Andreas'],
        name: 'Andreas',
        comment_ids: [6],
        user_id: 0,
        template_id: 6,
        visibility: 2,
        creationDate: "2021/02/12",
        stats: {
            upvotes: [0, 2],
            downvotes: [1],
            views: 0
        }
    };
    IDManager.registerNewMemeEntry();

    var defaultMeme2 = {
        _id: 1,
        url: '/memes/kunstwerk.png',
        captions: ['abstrakte', 'Kunst'],
        name: 'Kann das Weg?',
        comment_ids: [0, 1, 2, 3],
        user_id: 1,
        template_id: 9,
        visibility: 2,
        creationDate: "2021/02/13",
        stats: {
            upvotes: [0],
            downvotes: [1, 2],
            views: 0
        }
    };
    IDManager.registerNewMemeEntry();

    var defaultMeme3 = {
        _id: 2,
        url: '/memes/OMM2.png',
        captions: ['OMM'],
        name: 'OMM',
        comment_ids: [4, 5],
        user_id: 2,
        template_id: 2,
        visibility: 2,
        creationDate: "2021/02/14",
        stats: {
            upvotes: [0, 3],
            downvotes: [1, 2],
            views: 0
        }
    };
    IDManager.registerNewMemeEntry();

    var defaultMeme4 = {
        _id: 3,
        url: '/memes/crying.png',
        captions: ['nothing works'],
        name: 'Crying because nothing works',
        comment_ids: [],
        user_id: 1,
        template_id: 8,
        visibility: 2,
        creationDate: "2021/02/24",
        stats: {
            upvotes: [0, 3, 1, 2],
            downvotes: [],
            views: 0
        }
    };
    IDManager.registerNewMemeEntry();

    var defaultMeme5 = {
        _id: 4,
        url: '/memes/3_CreatedMeme.png',
        captions: ['I am once again asking'],
        name: 'What?',
        comment_ids: [],
        user_id: 0,
        template_id: 0,
        visibility: 2,
        creationDate: "2021/02/25",
        stats: {
            upvotes: [0, 1, 2],
            downvotes: [3],
            views: 0
        }
    };
    IDManager.registerNewMemeEntry();

    var defaultMeme6 = {
        _id: 5,
        url: '/memes/7_ChauDomi-kleinerSpa.png',
        captions: ['Chau', 'Domi'],
        name: 'Witzkekse',
        comment_ids: [],
        user_id: 2,
        template_id: 3,
        visibility: 2,
        creationDate: "2021/02/24",
        stats: {
            upvotes: [2, 0, 1],
            downvotes: [0, 1],
            views: 0
        }
    };
    IDManager.registerNewMemeEntry();


    await db.collection('memes').insertMany([defaultMeme, defaultMeme2, defaultMeme3, defaultMeme4, defaultMeme5, defaultMeme6]);
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
            upvotes: [0, 2],
            downvotes: [1],
            uses: 0
        }
    };
    IDManager.registerNewTemplateEntry();

    var defaultTemplate2 = {
        _id: 1,
        url: '/templates/button-decision.png',
        name: 'Two Buttons',
        user_id: 1,
        visibility: 0,
        stats: {
            upvotes: [0],
            downvotes: [1, 2],
            uses: 0
        }
    };
    IDManager.registerNewTemplateEntry();

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
    IDManager.registerNewTemplateEntry();

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
    IDManager.registerNewTemplateEntry();

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
    IDManager.registerNewTemplateEntry();

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
    IDManager.registerNewTemplateEntry();

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
    IDManager.registerNewTemplateEntry();

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
    IDManager.registerNewTemplateEntry();

    var defaultTemplate9 = {
        _id: 8,
        url: '/templates/nothing-works.png',
        name: 'Us devs crying when nothing works',
        user_id: 0,
        visibility: 2,
        stats: {
            upvotes: [],
            downvotes: [],
            uses: 0
        }
    };
    IDManager.registerNewTemplateEntry();

    var defaultTemplate10 = {
        _id: 9,
        url: '/templates/0_drawnimage.png',
        name: 'drawn image',
        user_id: 0,
        visibility: 2,
        stats: {
            upvotes: [],
            downvotes: [],
            uses: 0
        }
    };
    IDManager.registerNewTemplateEntry();

    await db.collection('templates').insertMany([defaultTemplate, defaultTemplate2, defaultTemplate3, defaultTemplate4, defaultTemplate5, defaultTemplate6, defaultTemplate7, defaultTemplate8, defaultTemplate9, defaultTemplate10]);
    console.log("Default templates inserted");

    // mongoose lokal db USER reset, without SCHMEMA
    await db.collection('users').deleteMany({});
    console.log("Old users deleted");

    var defaultUser = {
        _id: 0,
        username: 'TestUser1',
        email: 'test1@test.test',
        password: ['$2b$10$bPh0307ndeaDa8rTPuNbVemVeKDS0HAlKCMKsDuIgikxuSjYAr7Hq'] // "test1"
    };
    IDManager.registerNewUserEntry();

    var defaultUser2 = {
        _id: 1,
        username: 'TestUser2',
        email: 'test2@test.test',
        password: ['$2b$10$orDSwYLdBzucVXrglLYgOe4DD61N1tqBC9NsD6Qzr7bqXnv9wwS7i'] // "test2"
    };
    IDManager.registerNewUserEntry();

    var defaultUser3 = {
        _id: 2,
        username: 'TestUser3',
        email: 'test3@test.test',
        password: ['$2b$10$VnOz32TUvmvyTUM8mA8t9eDI/bSJLl9nnt9Sgz8f9fIxrNVgmivWq'] // "test3"
    };
    IDManager.registerNewUserEntry();

    await db.collection('users').insertMany([defaultUser, defaultUser2, defaultUser3]);
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
    IDManager.registerNewCommentEntry();

    var defaultComment2 = {
        _id: 1,
        user_id: 2,
        message: 'Wow, gar nicht lustig - wirklich 0 lustig ..',
        creationDate: '2021/02/12'
    };
    IDManager.registerNewCommentEntry();

    var defaultComment3 = {
        _id: 2,
        user_id: 1,
        message: 'Den verstehe ich nicht',
        creationDate: '2021/02/24'
    };
    IDManager.registerNewCommentEntry();

    var defaultComment4 = {
        _id: 3,
        user_id: 2,
        message: 'Was willst du damit sagen?',
        creationDate: '2021/02/25'
    };
    IDManager.registerNewCommentEntry();

    var defaultComment5 = {
        _id: 4,
        user_id: 0,
        message: 'Die Katze ist aber hübsch',
        creationDate: '2021/02/25'
    };
    IDManager.registerNewCommentEntry();

    var defaultComment6 = {
        _id: 5,
        user_id: 1,
        message: 'Witzig',
        creationDate: '2021/02/25'
    };
    IDManager.registerNewCommentEntry();

    var defaultComment7 = {
        _id: 6,
        user_id: 1,
        message: 'This is the funniest meme I have ever seen!!!',
        creationDate: '2021/02/26'
    };
    IDManager.registerNewCommentEntry();


    await db.collection('comments').insertMany([defaultComment, defaultComment2, defaultComment3, defaultComment4, defaultComment5, defaultComment6, defaultComment7]);
    console.log("Default comments inserted");

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
                upvotes: 9,
                downvotes: 6,
                views: 29
            },
            {
                date: "2021/02/10",
                upvotes: 13,
                downvotes: 4,
                views: 28
            },
            {
                date: "2021/02/11",
                upvotes: 14,
                downvotes: 6,
                views: 27
            },
            {
                date: "2021/02/12",
                upvotes: 15,
                downvotes: 7,
                views: 32
            },
            {
                date: "2021/02/13",
                upvotes: 14,
                downvotes: 4,
                views: 50
            },
            {
                date: "2021/02/14",
                upvotes: 17,
                downvotes: 6,
                views: 68
            },
            {
                date: "2021/02/15",
                upvotes: 19,
                downvotes: 7,
                views: 54
            },
            {
                date: "2021/02/16",
                upvotes: 28,
                downvotes: 3,
                views: 33
            },
            {
                date: "2021/02/17",
                upvotes: 26,
                downvotes: 6,
                views: 28
            },
            {
                date: "2021/02/18",
                upvotes: 23,
                downvotes: 7,
                views: 39
            },
            {
                date: "2021/02/19",
                upvotes: 20,
                downvotes: 9,
                views: 29
            },
            {
                date: "2021/02/20",
                upvotes: 29,
                downvotes: 6,
                views: 40
            },
            {
                date: "2021/02/21",
                upvotes: 32,
                downvotes: 4,
                views: 33
            },
            {
                date: "2021/02/22",
                upvotes: 34,
                downvotes: 6,
                views: 27
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

    var defaultTemplateStats3 = {
        _id: 2,
        days: [{
                date: "2021/02/09",
                upvotes: 32,
                downvotes: 4,
                uses: 48
            },
            {
                date: "2021/02/10",
                upvotes: 30,
                downvotes: 8,
                uses: 44
            },
            {
                date: "2021/02/11",
                upvotes: 23,
                downvotes: 5,
                uses: 34
            },
            {
                date: "2021/02/12",
                upvotes: 30,
                downvotes: 2,
                uses: 14
            },
            {
                date: "2021/02/13",
                upvotes: 59,
                downvotes: 6,
                uses: 23
            },
            {
                date: "2021/02/14",
                upvotes: 29,
                downvotes: 9,
                uses: 14
            },
            {
                date: "2021/02/15",
                upvotes: 45,
                downvotes: 8,
                uses: 23
            },
            {
                date: "2021/02/16",
                upvotes: 38,
                downvotes: 3,
                uses: 12
            },
            {
                date: "2021/02/17",
                upvotes: 25,
                downvotes: 9,
                uses: 13
            },
            {
                date: "2021/02/18",
                upvotes: 19,
                downvotes: 12,
                uses: 10
            },
            {
                date: "2021/02/19",
                upvotes: 33,
                downvotes: 7,
                uses: 24
            },
            {
                date: "2021/02/20",
                upvotes: 45,
                downvotes: 7,
                uses: 18
            },
            {
                date: "2021/02/21",
                upvotes: 8,
                downvotes: 9,
                uses: 15
            },
            {
                date: "2021/02/22",
                upvotes: 3,
                downvotes: 5,
                uses: 12
            }
        ]
    }

    var defaultTemplateStats4 = {
        _id: 3,
        days: [{
                date: "2021/02/09",
                upvotes: 23,
                downvotes: 8,
                uses: 23
            },
            {
                date: "2021/02/10",
                upvotes: 26,
                downvotes: 13,
                uses: 23
            },
            {
                date: "2021/02/11",
                upvotes: 14,
                downvotes: 7,
                uses: 23
            },
            {
                date: "2021/02/12",
                upvotes: 22,
                downvotes: 8,
                uses: 24
            },
            {
                date: "2021/02/13",
                upvotes: 46,
                downvotes: 13,
                uses: 13
            },
            {
                date: "2021/02/14",
                upvotes: 35,
                downvotes: 13,
                uses: 19
            },
            {
                date: "2021/02/15",
                upvotes: 22,
                downvotes: 19,
                uses: 12
            },
            {
                date: "2021/02/16",
                upvotes: 15,
                downvotes: 7,
                uses: 20
            },
            {
                date: "2021/02/17",
                upvotes: 33,
                downvotes: 20,
                uses: 20
            },
            {
                date: "2021/02/18",
                upvotes: 12,
                downvotes: 4,
                uses: 19
            },
            {
                date: "2021/02/19",
                upvotes: 23,
                downvotes: 9,
                uses: 18
            },
            {
                date: "2021/02/20",
                upvotes: 31,
                downvotes: 9,
                uses: 24
            },
            {
                date: "2021/02/21",
                upvotes: 23,
                downvotes: 14,
                uses: 12
            },
            {
                date: "2021/02/22",
                upvotes: 12,
                downvotes: 26,
                uses: 8
            }
        ]
    }

    var defaultTemplateStats5 = {
        _id: 4,
        days: [{
                date: "2021/02/09",
                upvotes: 33,
                downvotes: 12,
                uses: 17
            },
            {
                date: "2021/02/10",
                upvotes: 23,
                downvotes: 55,
                uses: 23
            },
            {
                date: "2021/02/11",
                upvotes: 55,
                downvotes: 23,
                uses: 12
            },
            {
                date: "2021/02/12",
                upvotes: 66,
                downvotes: 9,
                uses: 23
            },
            {
                date: "2021/02/13",
                upvotes: 32,
                downvotes: 24,
                uses: 11
            },
            {
                date: "2021/02/14",
                upvotes: 45,
                downvotes: 23,
                uses: 12
            },
            {
                date: "2021/02/15",
                upvotes: 34,
                downvotes: 23,
                uses: 8
            },
            {
                date: "2021/02/16",
                upvotes: 55,
                downvotes: 34,
                uses: 20
            },
            {
                date: "2021/02/17",
                upvotes: 23,
                downvotes: 18,
                uses: 18
            },
            {
                date: "2021/02/18",
                upvotes: 23,
                downvotes: 9,
                uses: 23
            },
            {
                date: "2021/02/19",
                upvotes: 33,
                downvotes: 14,
                uses: 21
            },
            {
                date: "2021/02/20",
                upvotes: 23,
                downvotes: 14,
                uses: 14
            },
            {
                date: "2021/02/21",
                upvotes: 44,
                downvotes: 24,
                uses: 24
            },
            {
                date: "2021/02/22",
                upvotes: 23,
                downvotes: 13,
                uses: 18
            }
        ]
    }

    var defaultTemplateStats6 = {
        _id: 5,
        days: [{
                date: "2021/02/09",
                upvotes: 67,
                downvotes: 45,
                uses: 33
            },
            {
                date: "2021/02/10",
                upvotes: 78,
                downvotes: 44,
                uses: 36
            },
            {
                date: "2021/02/11",
                upvotes: 83,
                downvotes: 45,
                uses: 29
            },
            {
                date: "2021/02/12",
                upvotes: 73,
                downvotes: 34,
                uses: 23
            },
            {
                date: "2021/02/13",
                upvotes: 68,
                downvotes: 33,
                uses: 22
            },
            {
                date: "2021/02/14",
                upvotes: 65,
                downvotes: 29,
                uses: 19
            },
            {
                date: "2021/02/15",
                upvotes: 50,
                downvotes: 34,
                uses: 22
            },
            {
                date: "2021/02/16",
                upvotes: 48,
                downvotes: 23,
                uses: 23
            },
            {
                date: "2021/02/17",
                upvotes: 42,
                downvotes: 27,
                uses: 18
            },
            {
                date: "2021/02/18",
                upvotes: 35,
                downvotes: 29,
                uses: 13
            },
            {
                date: "2021/02/19",
                upvotes: 30,
                downvotes: 34,
                uses: 14
            },
            {
                date: "2021/02/20",
                upvotes: 25,
                downvotes: 38,
                uses: 12
            },
            {
                date: "2021/02/21",
                upvotes: 24,
                downvotes: 34,
                uses: 15
            },
            {
                date: "2021/02/22",
                upvotes: 26,
                downvotes: 27,
                uses: 28
            }
        ]
    }

    var defaultTemplateStats7 = {
        _id: 6,
        days: [{
                date: "2021/02/09",
                upvotes: 23,
                downvotes: 35,
                uses: 45
            },
            {
                date: "2021/02/10",
                upvotes: 34,
                downvotes: 34,
                uses: 23
            },
            {
                date: "2021/02/11",
                upvotes: 45,
                downvotes: 23,
                uses: 18
            },
            {
                date: "2021/02/12",
                upvotes: 50,
                downvotes: 23,
                uses: 12
            },
            {
                date: "2021/02/13",
                upvotes: 38,
                downvotes: 23,
                uses: 12
            },
            {
                date: "2021/02/14",
                upvotes: 45,
                downvotes: 34,
                uses: 23
            },
            {
                date: "2021/02/15",
                upvotes: 30,
                downvotes: 23,
                uses: 23
            },
            {
                date: "2021/02/16",
                upvotes: 34,
                downvotes: 23,
                uses: 12
            },
            {
                date: "2021/02/17",
                upvotes: 36,
                downvotes: 28,
                uses: 13
            },
            {
                date: "2021/02/18",
                upvotes: 45,
                downvotes: 12,
                uses: 17
            },
            {
                date: "2021/02/19",
                upvotes: 20,
                downvotes: 24,
                uses: 12
            },
            {
                date: "2021/02/20",
                upvotes: 25,
                downvotes: 48,
                uses: 12
            },
            {
                date: "2021/02/21",
                upvotes: 34,
                downvotes: 24,
                uses: 13
            },
            {
                date: "2021/02/22",
                upvotes: 23,
                downvotes: 17,
                uses: 23
            }
        ]
    }

    var defaultTemplateStats8 = {
        _id: 7,
        days: [{
                date: "2021/02/09",
                upvotes: 34,
                downvotes: 25,
                uses: 23
            },
            {
                date: "2021/02/10",
                upvotes: 24,
                downvotes: 14,
                uses: 12
            },
            {
                date: "2021/02/11",
                upvotes: 23,
                downvotes: 33,
                uses: 12
            },
            {
                date: "2021/02/12",
                upvotes: 30,
                downvotes: 13,
                uses: 6
            },
            {
                date: "2021/02/13",
                upvotes: 58,
                downvotes: 13,
                uses: 23
            },
            {
                date: "2021/02/14",
                upvotes: 25,
                downvotes: 24,
                uses: 14
            },
            {
                date: "2021/02/15",
                upvotes: 20,
                downvotes: 33,
                uses: 12
            },
            {
                date: "2021/02/16",
                upvotes: 24,
                downvotes: 43,
                uses: 4
            },
            {
                date: "2021/02/17",
                upvotes: 26,
                downvotes: 38,
                uses: 11
            },
            {
                date: "2021/02/18",
                upvotes: 35,
                downvotes: 22,
                uses: 12
            },
            {
                date: "2021/02/19",
                upvotes: 10,
                downvotes: 14,
                uses: 4
            },
            {
                date: "2021/02/20",
                upvotes: 45,
                downvotes: 28,
                uses: 13
            },
            {
                date: "2021/02/21",
                upvotes: 44,
                downvotes: 34,
                uses: 13
            },
            {
                date: "2021/02/22",
                upvotes: 33,
                downvotes: 27,
                uses: 19
            }
        ]
    }

    var defaultTemplateStats9 = {
        _id: 8,
        days: [{
                date: "2021/02/09",
                upvotes: 21,
                downvotes: 15,
                uses: 25
            },
            {
                date: "2021/02/10",
                upvotes: 25,
                downvotes: 12,
                uses: 23
            },
            {
                date: "2021/02/11",
                upvotes: 33,
                downvotes: 13,
                uses: 16
            },
            {
                date: "2021/02/12",
                upvotes: 39,
                downvotes: 12,
                uses: 15
            },
            {
                date: "2021/02/13",
                upvotes: 48,
                downvotes: 3,
                uses: 26
            },
            {
                date: "2021/02/14",
                upvotes: 55,
                downvotes: 24,
                uses: 13
            },
            {
                date: "2021/02/15",
                upvotes: 60,
                downvotes: 23,
                uses: 16
            },
            {
                date: "2021/02/16",
                upvotes: 63,
                downvotes: 23,
                uses: 18
            },
            {
                date: "2021/02/17",
                upvotes: 66,
                downvotes: 18,
                uses: 22
            },
            {
                date: "2021/02/18",
                upvotes: 75,
                downvotes: 32,
                uses: 14
            },
            {
                date: "2021/02/19",
                upvotes: 70,
                downvotes: 24,
                uses: 12
            },
            {
                date: "2021/02/20",
                upvotes: 65,
                downvotes: 18,
                uses: 8
            },
            {
                date: "2021/02/21",
                upvotes: 68,
                downvotes: 25,
                uses: 22
            },
            {
                date: "2021/02/22",
                upvotes: 43,
                downvotes: 23,
                uses: 13
            }
        ]
    }

    await db.collection('templatestats').insertMany([defaultTemplateStats, defaultTemplateStats2, defaultTemplateStats3, defaultTemplateStats4, defaultTemplateStats5, defaultTemplateStats6, defaultTemplateStats7, defaultTemplateStats8, defaultTemplateStats9]);
    console.log("Default templatestats inserted");


    await db.collection('drafts').deleteMany({});
    console.log("Old drafts deleted");

    var defaultdraft = {
        "_id": 0,
        "template_id": 0,
        "user_id": 0,
        "title": "Da Truth My Brutha",
        "captions": [{
                "fontSize": 41,
                "colorR": 255,
                "colorG": 255,
                "colorB": 255,
                "bold": true,
                "italic": false,
                "fontFace": "Arial",
                "x": 173,
                "y": 791,
                "text": "for clear feature descriptions"
            },
            {
                "fontSize": 60,
                "colorR": 255,
                "colorG": 0,
                "colorB": 0,
                "bold": false,
                "italic": false,
                "fontFace": "Impact",
                "x": 268,
                "y": 102,
                "text": "Holla die Waldfee!"
            }
        ]
    }
    IDManager.registerNewDraftEntry();

    await db.collection('drafts').insertMany([defaultdraft]);
    console.log("Default drafts inserted");
}

//comment this line out if you don't want the DB to reset
resetDB();

module.exports = db;