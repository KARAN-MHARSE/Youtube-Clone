const User = require('../model/user.model')
const {ApiError} = require('../utils/ApiError')
const {asyncHandler} =  require('../utils/asyncHandler')
const {uploadOnCloudinary} = require('../utils/cloudinari')

const userRegister = asyncHandler(async(req,res)=>{
    const {userName, email,fullName,password} = req.body;
    if(
        [userName,email,fullName,password].some((fields)=> field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }
    
    const existedUser = await User.findOne({
        $or: [{userName},{email}]
    })
    
    if(existedUser){
        throw new ApiError(409,"Email id or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath)

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        userName:userName.toLowerCase(),
        email,
        fullName,
        avatar:avatar.url,
        password,
    })

    const createdUser = await User.findyById(user._id)
                        .select("-refreshToken -password")
    if(!createdUser){
        throw new Apo
    }

})


module.exports = {userRegister}