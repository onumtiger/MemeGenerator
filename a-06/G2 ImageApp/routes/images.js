var express = require('express');
var router = express.Router();

const imagesDB = require('../model/imagedatabase.json');

router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*'); //if the front-end HTML is run locally (the task lacks the description of where it is supposed to run), it's a different origin, so let's allow it.
    res.send(imagesDB);
});

module.exports = router;
