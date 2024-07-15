const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config({ path: '../.env' });
const app = express()

const port = process.env.PORT || 4000 
mongoose.connect(process.env.MONGODB_URI)
app.listen(port, () => {
    console.log(`PORT ${port}`)
})