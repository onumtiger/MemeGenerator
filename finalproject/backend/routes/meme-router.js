const express = require('express');
const MemeCtrl = require('../controllers/meme-ctrl');

const router = express.Router();

router.post('/meme', MemeCtrl.createMeme);
router.get('/meme/:id', MemeCtrl.getMemeById);
router.get('/meme', MemeCtrl.getMemes);
router.delete('/meme/:id', MemeCtrl.deleteMeme);
router.patch('/meme/:id', MemeCtrl.patchMeme);
router.post('/meme/upvote/:id', MemeCtrl.postUpvotesMeme);
router.post('/meme/downvote/:id', MemeCtrl.postDownvotesMeme);
router.post('/meme/view/:id', MemeCtrl.postViewsMeme);

router.post('/meme/imageCreation', MemeCtrl.executeImageCreation);

router.get('/stats', MemeCtrl.getStats);

module.exports = router;
