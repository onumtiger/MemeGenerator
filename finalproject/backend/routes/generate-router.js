const express = require('express');
const GenerateControl = require('../controllers/generate-ctrl.js');


const router = express.Router();

router.get('/generate', GenerateControl.executeImageCreation);
router.get('/getImages', GenerateControl.getSearchImages);

module.exports = router;
