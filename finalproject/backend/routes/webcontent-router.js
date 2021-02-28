const express = require('express');
const WebContentCtrl = require('../controllers/webcontent-ctrl');
const router = express.Router();

// for debugging URL query Strings
router.get('/queryTest', WebContentCtrl.testQueryParams);
router.get('/image/:url', WebContentCtrl.getWebImage);
router.get('/snapshot/:url', WebContentCtrl.getWebSnapshot);



module.exports = router;