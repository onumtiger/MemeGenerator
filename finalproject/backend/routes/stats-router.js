const express = require('express');
const StatsCtrl = require('../controllers/stats-ctrl');

const router = express.Router();

router.get('/meme/:id', StatsCtrl.getStatsForMeme);
router.get('/template/:id', StatsCtrl.getStatsForTemplate);

module.exports = router;