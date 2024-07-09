const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000
app.get('/', (req, res) => {
    res.send('Hello Kavya!')
})
app.listen(port, () => {
    console.log(`Demo started on PORT ${port}`)
})