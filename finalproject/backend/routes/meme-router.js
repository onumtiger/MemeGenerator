const express = require('express');
const MemeCtrl = require('../controllers/meme-ctrl');

const router = express.Router();

router.get('/', MemeCtrl.getMemes);
router.post('/', MemeCtrl.createMeme);
router.get('/:id', MemeCtrl.getMemeById);
router.delete('/:id', MemeCtrl.deleteMeme);
router.patch('/:id', MemeCtrl.patchMeme);
router.post('/upvote/:id', MemeCtrl.postUpvotesMeme);
router.post('/downvote/:id', MemeCtrl.postDownvotesMeme);
router.post('/view/:id', MemeCtrl.postViewsMeme);
router.post('/meme/imageCreation', MemeCtrl.executeImageCreation);

module.exports = router;
