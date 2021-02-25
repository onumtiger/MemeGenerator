const express = require('express');
const DraftCtrl = require('../controllers/draft-ctrl');

const router = express.Router();

router.get('/:userID', DraftCtrl.getDrafts);
router.post('/:userID', DraftCtrl.insertDraft);
router.delete('/:userID/:draftID', DraftCtrl.deleteDraft);

module.exports = router;