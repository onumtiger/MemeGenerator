var express = require('express');
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

router.post('/:category', function(req, res, next) {
    let cat = req.params.category;
    let [url, loc] = [req.body.url, req.body.location];

    if((cat && url && loc)){
        db.addImage({
            url: url,
            categories: [cat],
            location: loc
        });
        console.log(db.getAllImages());
        res.sendStatus(201);
    }else{
        res.sendStatus(400);
    }
});

module.exports = router;
