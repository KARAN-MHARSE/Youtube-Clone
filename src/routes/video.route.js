const express = require('express')
const router = express.Router()
const {uploadVideo,getVideoById,updateVideo} = require("../controllers/video.controller")
const {verifyUser} = require('../middleware/verifyUser.middleware')
const upload = require('../middleware/multer.middleware')

router.use(verifyUser)

router.route('/uploadVideo').post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbNail",
            maxCount:1
        }
    ]),
    uploadVideo
)

router.route("/vid/:videoId")
.get(getVideoById)
.patch(upload.single("thumbNail"),updateVideo)


module.exports = router