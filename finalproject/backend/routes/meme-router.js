const express = require('express')

const MemeCtrl = require('../controllers/meme-ctrl')

const router = express.Router()

const fileUpload = require('express-fileupload');
// const { UploadMeme } = require('../../frontend/src/pages/Upload');

router.use(fileUpload()); //without this, the body and files properties won't be there!

router.post('/meme', MemeCtrl.createMeme)
router.get('/meme/:id', MemeCtrl.getMemeById)
router.get('/meme', MemeCtrl.getMemes)

module.exports = router