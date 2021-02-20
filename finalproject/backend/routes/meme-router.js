const express = require('express');
const MemeCtrl = require('../controllers/meme-ctrl');

const router = express.Router();

router.post('/meme', MemeCtrl.createMeme);
router.get('/meme/:id', MemeCtrl.getMemeById);
router.get('/meme', MemeCtrl.getMemes);
router.delete('/meme/:id', MemeCtrl.deleteMeme);

router.get('/stats', MemeCtrl.getStats);
router.get('/memeswithstats', MemeCtrl.getMemesWithStats);

module.exports = router;
