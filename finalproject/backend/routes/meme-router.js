const express = require('express')
const MemeCtrl = require('../controllers/meme-ctrl')
const StatsCtrl = require('../controllers/stats-ctrl')
const fileUpload = require('express-fileupload');

const router = express.Router()
const Meme = require('../db/models/meme-model')
router.use(fileUpload()); //populates req.file for files uploads


router.post('/meme', MemeCtrl.createMeme)
router.get('/meme/:id', MemeCtrl.getMemeById)
router.get('/meme', MemeCtrl.getMemes)
router.get('/stats', MemeCtrl.getStats)
router.get('/stats/:id', StatsCtrl.updateStatsById)
router.get('/memeswithstats', MemeCtrl.getMemesWithStats)

module.exports = router