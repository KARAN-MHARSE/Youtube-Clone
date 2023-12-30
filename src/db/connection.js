const mongoose = require('mongoose')

const connection = async()=>{
    await mongoose.connect(process.env.CONNECTION_STRING);
}

module.exports = {connection}