const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const port = 8000
const app = express()

const uri = process.env.MONGODB_URI
console.log('MongoDB_URI: ', process.env.MONGODB_URI)
if(!uri){
    console.log('MongoDB URI is not defined in the environiment variables')
    process.exit(1)
}

mongoose.connect(uri)
.then(() => {
    console.log('Connected to MongoDB Atlas')
}).catch((err) => {
    console.log('Error connecting to MongoDB Atlas', err)
})
app.get('/', (req,res) => {
    res.send('Hello World')
})
app.listen(port, () => {
    console.log(`Server running on port`, port)
})
