const express = require('express');
const WebContentCtrl = require('../controllers/webcontent-ctrl');

const router = express.Router();

router.get('/', WebContentCtrl.test);
router.get('/image/:url', WebContentCtrl.getWebImage);
router.get('/snapshot/:url', WebContentCtrl.getWebSnapshot);

module.exports = router;