const Video = require('../model/video.model')
const {ApiError} = require('../utils/ApiError')
const {asyncHandler} = require('../utils/asyncHandler')
const {uploadOnCloudinary} = require('../utils/cloudinari')

// TO upload video
const uploadVideo = asyncHandler(async(req,res)=>{
    const {title,description} = req.body

    if(!title & !description){
        throw new ApiError(400,"Please anter the title and description of video")
    }
    
    const uploadedVideoLocalPath = req.files?.videoFile[0].path
    const thumbNailLocalPath = req.files?.thumbNail[0].path

    if(!uploadedVideoLocalPath || !thumbNailLocalPath){
        throw new ApiError(400,"VideoFile and thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(uploadedVideoLocalPath)
    const thumbNail = await uploadOnCloudinary(thumbNailLocalPath)

    if(!videoFile || !thumbNail){
        throw new ApiError(400,"videoFile and thumbnail is required")
    }

    const video = await Video.create({
        videoFile:videoFile.url,
        thumbNail:thumbNail.url,
        title,
        description,
        owner:req.user?._id
    })

    if(!video){
        throw new ApiError(400,"Something went wrong")
    }
    return res
    .status(201)
    .json({video})
})

// Get Specfic video
// const getVideoById = asyncHandler(async(req,res)=>{
//     const {videoId} = req.body

//     const video = await Video.findById(videoId).
// })

module.exports = {uploadVideo}