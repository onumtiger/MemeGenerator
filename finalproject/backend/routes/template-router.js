const express = require('express');
const TemplateCtrl = require('../controllers/template-ctrl');

const router = express.Router();

router.post('/templates', TemplateCtrl.createTemplate);
router.get('/templates/:id', TemplateCtrl.getTemplateById);
router.get('/templates', TemplateCtrl.getTemplates);
router.delete('/templates/:id', TemplateCtrl.deleteTemplate);

module.exports = router;