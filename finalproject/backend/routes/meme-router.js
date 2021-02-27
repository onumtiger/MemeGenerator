const express = require('express');
const MemeCtrl = require('../controllers/meme-ctrl');

const router = express.Router();

router.get('/', MemeCtrl.getMemes);
router.get('/own', MemeCtrl.getOwnMemes);
router.post('/', MemeCtrl.createMeme);
router.get('/:id', MemeCtrl.getMemeById);
router.delete('/:id', MemeCtrl.deleteMeme);
router.patch('/:id', MemeCtrl.patchMeme);
router.post('/upvote/:id', MemeCtrl.toggleUpvoteMeme);
router.post('/downvote/:id', MemeCtrl.toggleDownvoteMeme);
router.post('/view/:id', MemeCtrl.viewMeme);
router.get('/comments/:id', MemeCtrl.getCommentsByMemeId);


module.exports = router;
