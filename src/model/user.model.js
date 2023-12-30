const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required: true,
        lowercase:true,
        unique:true,
        trim:true,
    },
    fullName:{
        type:String,
        required: true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    }
},
{
    timestamps:true
}
) 

userSchema.pre("Save",async function(){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullName : this.fullName
        },
        process.env.ACCESS_SECRET_KEY,
        {
            expiresIn:process.env.ACCESS_EXPIRE_DATE
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_SECRET_KEY,
        {
            expiresIn:process.env.REFRESH_EXPIRE_DATE
        }
    )
}





module.exports = mongoose.model("User",userSchema)