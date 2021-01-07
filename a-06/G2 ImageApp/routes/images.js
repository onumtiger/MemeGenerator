var express = require('express');
var fileUpload = require('express-fileupload');
var router = express.Router();

const imageDBClass = require('../model/ImageDB');
const db = new imageDBClass();

const wrapForResponse = (imgArr)=>({images: imgArr});

router.get('/', function(req, res, next) {
    let locationQuery = req.query.location;
    let imgArr = db.getAllImages();
    if(locationQuery){
        imgArr = db.getImagesFilteredByProperties({location: locationQuery});
    }
    res.json(wrapForResponse(imgArr));
});

router.get('/:category', function(req, res, next) {
    let cat = req.params.category;
    let locationQuery = req.query.location;
    let imgArr = db.getAllImages();

    imgArr = db.getImagesFilteredByProperties(locationQuery ? {categories: cat, location: locationQuery} : {categories: cat});

    res.send({images: imgArr});
});

router.use(fileUpload()); //without this, the body and files properties won't be there!

router.post('/:category', function(req, res, next) {
    let cat = req.params.category;
    let [url, loc] = [req.body.url, req.body.location];

    if(!url){ //no url given - try to upload file if given
        if(req.files && req.files.image){
            //no url sent indicates a file upload, the other conditions make sure there actually is a file under req.files.image. If there is no file, url will remain undefined and a 400 code will be sent below.
            let img = req.files.image;
            img.mv('public/images/'+img.name, function(err){ //this overwrites an existing image at that filepath if there is one!
                if(err){
                    res.status(500).send(err);
                }else{
                    url = 'images/'+img.name;

                    //store the new image
                    db.addImage({
                        url: url,
                        categories: [cat],
                        location: loc
                    });
                    res.sendStatus(201);
                }
            });
        }else{
            res.status(400).send('Neither a URL nor a file was received!');
        }
    }else{ //url given
        //store the new image
        if((cat && loc)){
            db.addImage({
                url: url,
                categories: [cat],
                location: loc
            });
            res.sendStatus(201);
        }else{
            res.status(400).send('No valid category and/or location given!');
        }
    }
});

module.exports = router;
