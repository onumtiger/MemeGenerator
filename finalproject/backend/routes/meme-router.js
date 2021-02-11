const express = require('express');
const MemeCtrl = require('../controllers/meme-ctrl');
const fileUpload = require('express-fileupload');

const router = express.Router();

router.use(fileUpload()); //populates req.file for file uploads

router.post('/meme', MemeCtrl.createMeme);
router.get('/meme/:id', MemeCtrl.getMemeById);
router.get('/meme', MemeCtrl.getMemes);
router.delete('/meme/:id', MemeCtrl.deleteMeme);

module.exports = router;