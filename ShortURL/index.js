const express = require('express');
const app = express();
const {connectToMongoDB} = require('./connection.js');
const urlRoute = require('./routes/url.js');
require('dotenv').config();


const ConnectionURI = process.env.uri;
const port = 8001;
connectToMongoDB(ConnectionURI)
.then(() => {
    app.listen(port, () => {
        console.log(`Server started at PORT ${port}`);
    });
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});
app.use('/url', urlRoute);