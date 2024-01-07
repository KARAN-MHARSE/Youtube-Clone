const User = require('../model/user.model')
const {asyncHandler} = require('../utils/asyncHandler')
const {ApiError} = require('../utils/ApiError')
const {uploadOnCloudinary} = require('../utils/cloudinari')

const generateAccessRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong")
    }
}

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

const userLogin = asyncHandler(async(req,res)=>{
    const {userName,email,password} = req.body;

    if(!userName && !email){
        throw new ApiError(400,"Username ot email id is required")
    }
    
    const user = await User.findOne({
        $or:[{userName},{email}]
    })
    
    if(!user){
        throw new ApiError(404,"Invalid user credential")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    
    if(!isPasswordCorrect){
        throw new ApiError(401,"1Invalid user credential")
    }

    const {accessToken,refreshToken} = await generateAccessRefreshToken(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json({
        message:"User loggin successfully",
        user:loggedUser
    })
})

module.exports = {userRegister,userLogin}