const v2 = require('cloudinary')
const fs = require('fs')

v2.config({
    cloud_name: 'dgottdgvo', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})
          
const uploadOnCloudinary = async function(filepath){
    try {
        if(!filepath) return null
        
        const response = await v2.uploader.upload(filepath,{
            resource_type: "auto"
        })
        fs.unlinkSync(filepath)
        return response     
        
    } catch (error) {
        fs.unlinkSync(filepath)
        return null
    }
}

module.exports = {uploadOnCloudinary}