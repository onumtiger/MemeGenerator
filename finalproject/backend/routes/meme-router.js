const express = require('express')

const MemeCtrl = require('../controllers/meme-ctrl')

const router = express.Router()

const fileUpload = require('express-fileupload');
// const { UploadMeme } = require('../../frontend/src/pages/Upload');

router.use(fileUpload()); //without this, the body and files properties won't be there!

router.post('/meme', MemeCtrl.createMeme)
router.get('/meme/:id', MemeCtrl.getMemeById)
router.get('/meme', MemeCtrl.getMemes)

// router.post('/meme/:id', function(req, res, next) {
//     //let cat = req.params.category;
//     let id = UploadMeme.id;
//     let caps = UploadMeme.caps;
//     let [url] = [req.body.url, req.body.location];
//     if(!url){ //no url given - try to upload file if given
//         if(req.files && req.files.image){
//             //no url sent indicates a file upload, the other conditions make sure there actually is a file under req.files.image. If there is no file, url will remain undefined and a 400 code will be sent below.
//             let img = req.files.image;
//             img.mv('public/images/'+img.name, function(err){ //this overwrites an existing image at that filepath if there is one!
//                 if(err){
//                     res.status(500).send(err);
//                 }else{
//                     url = 'images/'+img.name;

//                     //store the new image
//                     db.addImage({
//                         _id: id,
//                         url: url,
//                         captions: [caps[0], caps[1]]
//                     });
//                     res.sendStatus(201);
//                 }
//             });
//         }else{
//             res.status(400).send('Neither a URL nor a file was received!');
//         }
//     }else{ //url given
//         //store the new image
//         if((id && caps)){
//             db.addImage({
//                 _id: id,
//                 url: url,
//                 captions: [caps[0], caps[1]]
//             });
//             res.sendStatus(201);
//         }else{
//             res.status(400).send('No valid id and/or captions given!');
//         }
//     }
// });

/*
// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});
*/


module.exports = router