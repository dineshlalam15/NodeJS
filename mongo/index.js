import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log(`Database Connection Successful`);
    app.listen(port, () => {
        console.log(`Application started on PORT ${port}`);
    });
}).catch((error) => {
    console.error("Error: ", error);
    process.exit(1);
});

const personSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        place: {
            type: String,
            required: true
        },
        vehicle: {
            type: String,
            required: true
        },
    }, { timestamps: true }
)
const Person = mongoose.model('Person', personSchema, 'Person_Details')

app.get('/persons', async (req, res) => {
    try {
        const persons = await Person.find({})
        return res.status(200).json(persons)
    } catch (err) {
        console.error('Error retrieving persons:', err);
        return res.status(500).json({ error: 'An error occured while retrieving persons details' });
    }
})

app.post('/newperson', async (req, res) => {
    const body = req.body
    try{
        const lastUser = await Person.findOne().sort({ id: -1 });
        const newPersonId = lastUser ? lastUser.id + 1 : 1
        const newPerson = new Person(
            {
                id: newPersonId,
                first_name: body.first_name,
                last_name: body.last_name,
                gender: body.gender,
                place: body.place,
                vehicle: body.vehicle
            }
        )
        const savedPerson = await newPerson.save()
        return res.status(201).json(savedPerson)
    } catch (err) {
        console.error('Error savong new person:', err)
        return res.status(500).json({error: 'An error occured while saving new person'})
    }
})

app.route('/person/:id')
.get(async (req, res) => {
    const findId = req.params.id;
    try {
        const findPerson = await Person.findOne({ id: findId });
        console.log(findPerson);
        if (findPerson) {
            return res.status(200).json(findPerson);
        } else {
            return res.status(404).json({ error: `Person with id ${findId} does not exist` });
        }
    } catch (err) {
        console.error('Error fetching person details:', err);
        return res.status(500).json({ error: 'An error occurred while fetching the person details' });
    }
})
.delete(async (req, res) => {
    const findId = req.params.id
    try {
        const deletedPerson = await Person.findOneAndDelete({ id: findId });
        if (!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        console.log(deletedPerson)
        return res.status(200).json({ message: 'Person Deleted successfully', person: deletedPerson });
    } catch (err) {
        console.error('Error deleting person:', err);
        return res.status(500).json({ error: 'An error occurred while deleting person details' });
    }
})
.patch(async (req, res) => {
    const findId = req.params.id
    const body = req.body;
    try {
        const findPerson = await Person.findOne({id: findId})
        if(!findPerson){
            return res.status(404).json({"Message": `User with id ${findId} doesn't exist`})
        }
        const updatedPerson = await Person.findOneAndUpdate({ id: findId },
            {
                first_name: body.first_name ? body.first_name : findPerson.first_name,
                last_name: body.last_name ? body.last_name : findPerson.last_name,
                gender: body.gender ? body.gender : findPerson.gender,
                place: body.place ? body.place : findPerson.place,
                vehicle: body.vehicle ? body.vehicle : findPerson.vehicle
            },
            { new: true }
        );
        if (updatedPerson) {
            return res.status(200).json(updatedPerson);
        } else {
            return res.status(404).json({"Message": `User with id ${findId} doesn't exist`})
        }
    } catch (err) {
        console.error('Error updating person:', err);
        return res.status(500).json({ error: 'An error occurred while editing the person details' });
    }
})