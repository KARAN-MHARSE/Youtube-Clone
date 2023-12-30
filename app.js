const express = require('express')
const dotenv = require('dotenv')
const {connection} = require('./src/db/connection')


const app = express()
dotenv.config()

// Variables
const port = process.env.PORT || 5000






// Connect to the database and then listen for server
const start = async()=>{
    await connection()
    .then(app.listen(port,console.log(`The server is listening on port ${port}`)))
    .catch((err)=> console.log(err))
}
start()
