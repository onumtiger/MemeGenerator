const express = require('express');
const GUIDataCtrl = require('../controllers/guidata-ctrl');

const router = express.Router();

router.get('/visibility-options/meme/:userId', GUIDataCtrl.getMemeVisibilityOptions);
router.get('/visibility-options/template/:userId', GUIDataCtrl.getTemplateVisibilityOptions);

module.exports = router;