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
const getVideoById = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video is not exist")
    }

    return res
    .status(201)
    .json(video)
})

const updateVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {title, description} = req.body

    if(!videoId){
        throw new ApiError(400,"Video not exist")
    }
    if(!title || !description){
        throw new ApiError(400,'Title and description required')
    }

    const thumbnailLocalPath = req.file?.path
    if(!thumbnailLocalPath){
        throw new ApiError(500,"Thumbnail file is required")
    }

    // const prevVideoDetail = await Video.findById(videoId)
    // console.log(req.user?._id)
    // if(prevVideoDetail.owner != req.user?._id){
    //     throw new ApiError(500,"You are not authorised to update details")
    // }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title:title,
                description,
                thumbnail:thumbnailLocalPath
            }
        },
        {new:true}
    )

    if(!video){
        throw new ApiError(400,"No such video")
    }
    return res
    .status(200)
    .json(video)
})



module.exports = {uploadVideo,getVideoById,updateVideo}