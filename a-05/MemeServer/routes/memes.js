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
    console.log(newMeme);

    //integrate in database
    // req.db.memes.update({"_id" : ObjectId("5fde40976d7bd19a6927f765")}, 
    //              {'$set': {'memeURLs.-1': newMeme}})
    // req.db.memes.update({ _id: ObjectId("5fde40976d7bd19a6927f765")},
    //   { $push: {
    //     MemeURLs: {
    //       $each: [ {name: newMeme} ],
    //       $position: 1
    //     }
    //   }}
    // )

    req.db.memes.updateOne(
      { _id: ObjectId("5fde40976d7bd19a6927f765") },
      { $push: { MemeURLs: [newMeme] } },
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );

    // memes.memeURLs.push(newMeme);
    // res.send({
    //     code: 200,
    //     message: 'stored meme',
    //     memes
    // });
});

module.exports = router;
