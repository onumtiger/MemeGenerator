const express = require('express')
var bodyParser = require('body-parser');
const MemeCtrl = require('../controllers/meme-ctrl')
const fileUpload = require('express-fileupload');


const router = express.Router()
const Meme = require('../db/models/meme-model')
router.use(fileUpload()); //populates req.file for files uploads


router.post('/meme', MemeCtrl.createMeme)
router.patch('/meme/:id', MemeCtrl.patchMeme)
router.get('/meme/:id', MemeCtrl.getMemeById)
router.get('/meme', MemeCtrl.getMemes)
router.get('/stats', MemeCtrl.getStats)



module.exports = router