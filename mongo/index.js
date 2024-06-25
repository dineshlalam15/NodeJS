const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const port = 8000;
const app = express();
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.log('MongoDB URI is not defined in the environment variables');
    process.exit(1);
}
mongoose.connect(uri, { 
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
});

const personModel = require('./models/person');
app.get('/persons', async (req, res) => {
    try {
        const persons = await personModel.find({})
        return res.json(persons)
    } catch (err) {
        console.error('Error retrieving persons:', err);
        return res.status(500).json({ error: 'Error occurred while retrieving persons' });
    }
});