const express = require('express');
const WebContentCtrl = require('../controllers/webcontent-ctrl');

const router = express.Router();

router.get('/image', WebContentCtrl.getWebImage);
router.get('/snapshot', WebContentCtrl.getWebSnapshot);

module.exports = router;