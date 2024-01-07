const express = require('express')
const dotenv = require('dotenv')
const {connection} = require('./src/db/connection')
const UserRoute = require('./src/routes/user.route')


const app = express()
dotenv.config()

// middleware
app.use(express.json())

// Global error handling
app.use((error,req,res,next)=>{
    error.statusCode = error.statusCode || 500
    res.status(error.statusCode),json({
        status:error.statusCode,
        message:error.message
    })
})

// Routes Declare
app.use('/api/v1/user',UserRoute)


// Variables
const port = process.env.PORT || 5000






// Connect to the database and then listen for server
const start = async()=>{
    await connection()
    .then(app.listen(port,console.log(`The server is listening on port ${port}`)))
    .catch((err)=> console.log(err))
}
start()
