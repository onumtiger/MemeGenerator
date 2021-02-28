const express = require('express');
const GenerateControl = require('../controllers/generate-ctrl.js');
const router = express.Router();

// IMAGE GENERATION/CREATION & SEARCH VIA API
router.get('/generate', GenerateControl.executeImageCreation);
router.get('/getImages', GenerateControl.getSearchImages);

module.exports = router;
