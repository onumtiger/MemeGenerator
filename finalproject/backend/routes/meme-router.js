const express = require('express');
const MemeCtrl = require('../controllers/meme-ctrl');

const router = express.Router();

router.post('/meme', MemeCtrl.createMeme);
router.get('/meme/:id', MemeCtrl.getMemeById);
router.get('/meme', MemeCtrl.getMemes);
router.delete('/meme/:id', MemeCtrl.deleteMeme);

module.exports = router;