const express = require('express')
const router = express.Router()
const {userRegister,userLogin} = require('../controllers/user.controller')
const upload = require("../middleware/multer.middleware")


router.route('/register').post(
    upload.single('avatar'),userRegister
)
router.route('/login').post(userLogin)


module.exports = router