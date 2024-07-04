const express = require('express');
const app = express();
const {connectToMongoDB} = require('./connection.js');
const urlRoute = require('./routes/url.js');
const port = 8001;

app.use('/url', urlRoute);
app.listen(port, () => {
    console.log(`Server started on ${port}`)
})