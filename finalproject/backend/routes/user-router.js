const express = require("express")
const router = express.Router()

const UserCtrl = require('../controllers/user-ctrl')
const checkAuth = require('../middleware/check-auth');


router.post('/signup', UserCtrl.signup)
router.post('/login', UserCtrl.login)
router.delete('/:userId', checkAuth, UserCtrl.deleteUser)


module.exports = router