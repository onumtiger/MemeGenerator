var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/memes";

//Mongo
const Meme = require('../models/meme.js');

//Mongo 
router.get('/', function(req, res, next) {
  var item;
  var currentItem;
  var memeArray = [];
  

  Meme.find({},function(err, list){
    console.log(list[1])
    for (item = 0; item < list.length; item++){
      currentItem = list[item].memeURL;
      memeArray[item] = currentItem;
      console.log(memeArray[item])
    }

    if (err) {
      console.log("Error: "+err);
    } else {
      console.log("Items in database: "+list.length);
      res.send({
          code: 200,
          /*TODO: Send an array of memes stored within the collection "memes"
          at this point there is only one meme url 
          */
          memes: memeArray
          //memes: list[0].memeURL
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
router.post('/', function(req, res) {
  console.log("entered post");
    const newMeme = req.body; 
    console.log("URL to save: "+newMeme);
    const newEntry = new Meme({ memeURL: newMeme.url}); //get specific values and print them into SCHEMA
    newEntry.save((error)=>{
      if(error){
          res.status(500).json({msg: 'Sorry not saved!'});
      } else {
        res.json({
          msg: 'Data has been saved!'
        });
      }
    });
    

  

    //THIS WORKS BUT ITS NOT MONGOOSE
    // MongoClient.connect(url, function(err, db) {
    //   if (err) throw err;
    //   var dbo = db.db("memes");
    //   var myquery = { memeURLs: "https://i.imgflip.com/4pke9r.jpg" };
    //   var newvalues = { $set: {memeURLs: newMeme } };
    //   dbo.collection("memes").updateOne(myquery, newvalues, function(err, res) {
    //     if (err) throw err;
    //     console.log("1 document updated");
    //     db.close();
    //   });
    // });

  
    

    // Meme.findOneAndUpdate(
    //   { _id: "5fde40976d7bd19a6927f765" },
    //   { $push: { MemeURLs: [newMeme] } },

      
    
    //   function(err, result) {
    //     console.log("entered find one and update");
    //     if (err) {
    //       console.log(err);
    //       res.send(err);
    //     } else {
    //       console.log(result);
    //       res.send(result);
    //     }
    //   }
    // );

    //console.log(req.db)
    //console.log(Meme);

    // memes.memeURLs.push(newMeme);
    // res.send({
    //     code: 200,
    //     message: 'stored meme',
    //     memes
    // });
});

module.exports = router;
