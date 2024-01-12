const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},
{timeStamps:true})

module.exports = mongoose.model("Subscription",subscriptionSchema)