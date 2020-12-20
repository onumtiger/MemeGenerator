var express = require('express');
var router = express.Router();

//Mongo
const Meme = require('../models/meme.js');


//Mongo 
router.get('/', function(req, res, next) {
  Meme.find({},function(err, list){
    if (err) {
      console.log("Error: "+err);
    } else {
      //console.log(list);
      res.send({
          code: 200,
          memes: list[0]
        });
      //res.render('memes', {memelist: list});
    }
  });
});


// /* GET meme URLs. */
// router.get('/', function(req, res, next) {
//     res.send({
//         code: 200,
//         memes
//       });
//   });

/* GET meme URLs. */
/*
 router.get('/', function(req, res, next) {
   res.send({
       code: 200,
       memes
     });
 }); */

/* POST a meme URL */
router.post('/', function(req, res, next) {
    let newMeme = req.body.url;

    //integrate in database
    Meme.update({"_id" : ObjectId("5fde3bdd42fcee4231e7e672")}, 
                 {'$set': {'memeURLs.-1': newMeme}})
    alert("Nachricht "+newMeme);

    memes.memeURLs.push(newMeme);
    res.send({
        code: 200,
        message: 'stored meme',
        memes
    });
});

module.exports = router;
