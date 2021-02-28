const express = require('express');
const TemplateCtrl = require('../controllers/template-ctrl');
const router = express.Router();

// TEMPLATE
router.get('/', TemplateCtrl.getTemplates);
router.post('/', TemplateCtrl.createTemplate);
router.get('/:id', TemplateCtrl.getTemplateById);
router.post('/upvote/:id', TemplateCtrl.toggleUpvoteTemplate);
router.post('/downvote/:id', TemplateCtrl.toggleDownvoteTemplate);
router.delete('/:id', TemplateCtrl.deleteTemplate);

module.exports = router;