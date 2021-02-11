const express = require('express');
const TemplateCtrl = require('../controllers/template-ctrl');
const fileUpload = require('express-fileupload');

const router = express.Router();

router.use(fileUpload()); //populates req.file for file uploads

router.post('/templates', TemplateCtrl.createTemplate);
router.get('/templates/:id', TemplateCtrl.getTemplateById);
router.get('/templates', TemplateCtrl.getTemplates);
router.delete('/templates/:id', TemplateCtrl.deleteTemplate);

module.exports = router;