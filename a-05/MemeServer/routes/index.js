var express = require('express');
var router = express.Router();

//Mongo
const Meme = require('../models/meme.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Mongo 
router.get('/', function(req, res, next) {
  Meme.find({},function(err, list){ if (err)
    console.log(err);
  else {
    console.log(list);
     res.render('meme', {memelist: list}); }
  }) 
});

module.exports = router;
