var express = require('express');
var router = express.Router();

//Mongo
const Meme = require('../models/meme.js');


//Mongo 
router.get('/', function(req, res, next) {
  Meme.find({},function(err, list){ if (err) {
    console.log(err); console.log("hihi");}
  else {
    console.log(list);
    console.log("hoho");
    res.render('memes', {memelist: list}); }
  }) 
});


// /* GET meme URLs. */
// router.get('/', function(req, res, next) {
//     res.send({
//         code: 200,
//         memes
//       });
//   });

/* GET meme URLs. */
 router.get('/', function(req, res, next) {
   res.send({
       code: 200,
       memes
     });
 });

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
