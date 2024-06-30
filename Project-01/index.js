const express = require('express')
const MongoDB = require('mongoose')
require('dotenv').config()

const port = 8000
const app = express()

app.use(express.json())
const uri = process.env.ConnectionURI
if(!uri){
    console.log('uri is not defined in the environiment variables')
    process.exit(1)
}
MongoDB.connect(uri, {
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB Atlas')
    app.listen(port, () => {
        console.log('Server running on PORT', port)
    })
}).catch((err) => {
    console.log('Error connecting to MongoDB Atlas', err)
    process.exit(1)
})

const dataSchema = new MongoDB.Schema({
    id:{
        type: Number,
        require: true,
        unique: true
    },
    FirstName: {
        type: String,
        require: true,
    },
    LastName: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    Job: {
        type: String,
        require: true
    }
})
const dataModel = MongoDB.model('dataModel', dataSchema, 'Data')
app.get('/users', async (req, res) => {
    try{
        const data = await dataModel.find({})
        return res.json(data)
    } catch(err){
        console.log('Error retreiving the data', err)
        return res.status(500).json({error: 'Error occured while retrieving persons'})
    }
})
app.get('/users/:id', async (req, res) => {
    try{
        const findUser = await dataModel.findOne({id: Number(req.params.id)})
        const result = findUser ? res.status(200).json(findUser) : res.status(404).json({Error: "Person with that id don't exist"})
        return result
    } catch(err){
        console.log(err)
        return res.status(500).json({Error: 'Internal Server Error'})
    }
})
app.delete('/users/:id', async (req, res) => {
    try{
        const deletedUser = await dataModel.findOneAndDelete({id: Number(req.params.id)})
        const result = deletedUser ? res.status(200).json({User: deletedUser, Message: "User deleted succesfully"}) : res.status(404).json({Error: "User with this id number doesn't exist"})  
        return result
    } catch(err){
        console.log(err)
        return res.status(500).json({Error: err})
    }
})
app.post('/newuser', async(req, res) => {
    const body = req.body
    console.log(body)
    try{
        const lastUser = await dataModel.findOne().sort({ id: -1 });
        const newUserId = lastUser ? lastUser.id + 1 : 1;
        const newUser = new dataModel({
            id: newUserId,
            FirstName: body.FirstName,
            LastName: body.LastName,
            gender: body.gender,
            email: body.email,
            Job: body.Job
        })
        const data = await newUser.save()
        return res.status(201).json(data)
    } catch(err){
        console.log(err)
        return res.status(500).json({error: 'Error occured while saving a new user'})
    }
})