const express = require('express');
const TemplateCtrl = require('../controllers/template-ctrl');

const router = express.Router();

router.get('/', TemplateCtrl.getTemplates);
router.post('/', TemplateCtrl.createTemplate);
router.get('/:id', TemplateCtrl.getTemplateById);
router.delete('/:id', TemplateCtrl.deleteTemplate);

module.exports = router;