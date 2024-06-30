const express = require('express');
const connectMongoDB = require('./connection.js');
require('dotenv').config();

const router = require('./routes/user');
const port = 8000;
const app = express();

app.use(express.json());
app.use('/users', router);

const uri = process.env.ConnectionURI;
connectMongoDB(uri)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server started at PORT ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });