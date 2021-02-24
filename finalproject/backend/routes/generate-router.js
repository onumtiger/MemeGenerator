const express = require('express');
const GenerateControl = require('../controllers/generate-ctrl.js');


const router = express.Router();

router.get('/', GenerateControl.executeImageCreation);
router.get('/parameters', GenerateControl.getSearchImages);

module.exports = router;
