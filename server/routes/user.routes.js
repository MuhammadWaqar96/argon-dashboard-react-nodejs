const express = require('express')
const expressformidable = require('express-formidable-v2')

const controllers = require('../controllers/user.controllers')

const router = express.Router()

router.get('/profile', controllers.getUserProfile)
router.get('/profile/all', controllers.getAllUsers)
router.put('/profile', controllers.updateProfile)
router.post('/upload-avatar', expressformidable(), controllers.uploadProfileImage)

module.exports = router
