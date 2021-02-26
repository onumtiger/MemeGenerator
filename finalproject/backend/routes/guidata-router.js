const express = require('express');
const GUIDataCtrl = require('../controllers/guidata-ctrl');

const router = express.Router();

router.get('/visibility-options/meme/', GUIDataCtrl.getMemeVisibilityOptions);
router.get('/visibility-options/template/', GUIDataCtrl.getTemplateVisibilityOptions);

module.exports = router;