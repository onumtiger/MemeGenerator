const express = require('express');
const GenerateControl = require('../controllers/generate-ctrl.js');


const router = express.Router();

router.get('/', GenerateControl.executeImageCreation);

module.exports = router;
