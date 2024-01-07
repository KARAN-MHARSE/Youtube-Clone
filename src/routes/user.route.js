const express = require('express')
const router = express.Router()
const {userRegister,userLogin,userLogout} = require('../controllers/user.controller')
const upload = require("../middleware/multer.middleware")
const {verifyUser} = require('../middleware/verifyUser.middleware')


router.route('/register').post(
    upload.single('avatar'),userRegister
)
router.route('/login').post(userLogin)
router.route('/logout').post(verifyUser,userLogout)


module.exports = router