const express = require('express')
const router = express.Router()
const {userRegister} = require('../controllers/user.controller')
const upload = require("../middleware/multer.middleware")


router.route('/register').post(
    upload.single('avatar'),userRegister
)


module.exports = router