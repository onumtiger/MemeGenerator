var express = require('express');
var router = express.Router();

// let memes = {memeURLs: [ //sample memes
//     'https://i.imgflip.com/4pke9r.jpg',
//     'https://i.imgflip.com/4osa73.jpg',
//     'https://i.imgflip.com/4pcn16.jpg'
// ]};

router.get('/', function (req, res) {
    // const db = req.db;

    let memes = db.get('Memes');
    // memes.find({}, { url: 1 }).toArray(function(err, docs){
    //     console.log("retrieved records:");
    //     console.log(docs);
    //     return docs;
    // });
    memes.find({}, { url: 1 })
        .then((docs) => res.json(docs))
        .catch((e) => res.status(500).send())


    res.send({
        code: 200,
        memeURLs: memes
    })

})

/* GET meme URLs. */
// router.get('/', function(req, res, next) {
//   res.send({
//       code: 200,
//       memes
//     });
// });

/* POST a meme URL */
router.post('/', function(req, res, next) {
    let newMeme = req.body.url;
    memes.memeURLs.push(newMeme);
    res.send({
        code: 200,
        message: 'stored meme',
        memes
    });
});

module.exports = router;
