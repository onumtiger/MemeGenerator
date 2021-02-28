const express = require('express');
const DraftCtrl = require('../controllers/draft-ctrl');
const router = express.Router();

// DRAFT 
router.get('/', DraftCtrl.getDrafts);
router.post('/', DraftCtrl.insertDraft);
router.delete('/:draftId', DraftCtrl.deleteDraft);

module.exports = router;