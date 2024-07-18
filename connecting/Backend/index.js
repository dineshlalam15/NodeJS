import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = process.env.PORT || 4000

app.use(cors()) 

app.get('/api/details', (req, res) => {
    const details = [
    {
        id: 1,
        name: "Dinesh",
        dept: "Metallurgy & Materials Engineering",
    },
    {
        id: 2,
        name: "Vishnu Vardhan Reddy",
        dept: "Electrical Engineering",
    },
    {
        id: 3,
        name: "Bhuvan Chandra",
        dept: "Mechanical Engineering",
    },
    {
        id: 4,
        name: "Dilleswar Reddy",
        dept: "Aerospace Engineering & Applied Mechanics",
    },
    {
        id: 5,
        name: "Chirag Vaibhav",
        dept: "Computer Science and Technology",
    }]
    return res.json(details)
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})