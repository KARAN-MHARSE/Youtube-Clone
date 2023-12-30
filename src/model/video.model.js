const mongoose = require('mongoose')


const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String,
        required:true
    },
    thumbNail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default : 0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    
},
{
    timestamps:true
})