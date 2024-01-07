const User = require('../model/user.model')
const {asyncHandler} = require('../utils/asyncHandler')
const {ApiError} = require('../utils/ApiError')
const jwt = require('jsonwebtoken')

const verifyUser = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer',"")
        if(!token){
            throw new ApiError(401,"Unauthorized User")
        }

        const decodedToken = await jwt.verify(token,process.env.ACCESS_SECRET_KEY)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"Unauthorised user")
        }
        
        req.user = user
        next()        
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})

module.exports = {verifyUser}