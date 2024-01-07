const express = require('express')
const router = express.Router()
const {userRegister,userLogin,userLogout,changeCurrentPassword,updateAvatar} = require('../controllers/user.controller')
const upload = require("../middleware/multer.middleware")
const {verifyUser} = require('../middleware/verifyUser.middleware')


router.route('/register').post(
    upload.single('avatar'),userRegister
)
router.route('/login').post(userLogin)

// Secure routes
router.route('/logout').post(verifyUser,userLogout)
router.route('/changePassword').post(verifyUser,changeCurrentPassword)
router.route('/updateAvatar').post(verifyUser,upload.single('avatar'),updateAvatar)


module.exports = router