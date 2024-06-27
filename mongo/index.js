const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const port = 8000;
const app = express();
app.use(express.json())

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
})
app.post('/newuser', async (req, res) => {
    const body = req.body
    console.log('Request body:', req.body);
    const newPerson = new personModel({
        FirstName: body.FirstName,
        LastName: body.LastName,
        Gender: body.Gender,
        Place: body.Place,
        Industry: body.Industry,
        Vehicle: body.Vehicle
    })
    try{
        const savedPerson = await newPerson.save()
        return res.status(201).json(savedPerson)
    } catch (err) {
        console.error('Error savong new person:', err)
        return res.status(500).json({error: 'Error occured while saving new person'})
    }
})
app.delete('/person/:FirstName', async (req, res) => {
    const firstName = req.params.FirstName;
    try {
        const deletedPerson = await personModel.findOneAndDelete({ FirstName: firstName });
        if (!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        console.log(deletedPerson)
        return res.status(200).json({ message: 'Person deleted successfully', person: deletedPerson });
    } catch (err) {
        console.error('Error deleting person:', err);
        return res.status(500).json({ error: 'Error occurred while deleting person' });
    }
})