const express = require('express');
const MemeCtrl = require('../controllers/meme-ctrl');

const router = express.Router();

router.get('/', MemeCtrl.getMemes);
router.get('/own', MemeCtrl.getOwnMemes);
router.post('/', MemeCtrl.createMeme);
router.get('/:id', MemeCtrl.getMemeById);
router.delete('/:id', MemeCtrl.deleteMeme);
router.patch('/:id', MemeCtrl.patchMeme);
router.post('/upvote/:id', MemeCtrl.upvoteMeme);
router.post('/downvote/:id', MemeCtrl.downvoteMeme);
router.post('/view/:id', MemeCtrl.viewMeme);


module.exports = router;
