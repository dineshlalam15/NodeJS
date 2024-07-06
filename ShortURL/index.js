const express = require('express');
const app = express();
const {connectToMongoDB} = require('./connection.js');
const URLRouter = require('./routes/url.js');
require('dotenv').config();

app.use(express.json())
app.use('/url', URLRouter);

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