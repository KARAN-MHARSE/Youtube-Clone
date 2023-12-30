const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
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



module.exports = mongoose.model("User",userSchema)