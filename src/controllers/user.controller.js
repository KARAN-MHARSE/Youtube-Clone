const User = require('../model/user.model')
const {asyncHandler} = require('../utils/asyncHandler')
const {ApiError} = require('../utils/ApiError')
const {uploadOnCloudinary} = require('../utils/cloudinari')
const userRegister = asyncHandler(async(req,res)=>{
    const {userName,email,fullName,password} = req.body

    if([userName,email,fullName,password].some((fields)=>fields?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or:[{userName},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User already  registered")
    }

    const avatarLocalPath = req.file?.path
    console.log(avatarLocalPath)
    if(!avatarLocalPath){
        throw new ApiError(400,'1Avatar file is required')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        userName:userName.toLowerCase(),
        email,
        fullName,
        avatar : avatar.url,
        password
    })

    const createdUser = await User.findById(user._id).select("-refreshToken -password")
    if(!createdUser){
        throw new ApiError(500,"Something went wrong,Plaese try again")
    }
    return res.status(201).json(createdUser)
})

module.exports = {userRegister}