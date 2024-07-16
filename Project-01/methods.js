import User from './model.js';
import express from 'express'

const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({extended: true}))

router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find({})
        return res.status(200).json(allUsers)
    } catch (err) {
        console.error('Error retrieving the data', err);
        return res.status(500).json({ Error: 'Error occurred while retrieving the users details' });
    }
});
router.post('/register', async (req, res) => {
    const body = req.body
    try{
        const lastUser = await User.findOne().sort({ ID: -1 })
        const newUserID = lastUser ? lastUser.ID + 1 : 1
        const newUser = new User({
            ID: newUserID,
            Name: body.Name,
            Gender: body.Gender,
            Country: body.Country,
            Company: body.Company,
            Credit_Card: body.Credit_Card,
            Bank_Balance: body.Bank_Balance
        })
        const savedUser = await newUser.save()
        console.log(savedUser)
        return res.status(201).json({"Details of the registered user": savedUser})
    } catch(err){
        console.error('Error registring the new user', err)
        return res.status(500).json({Error: 'Error occurred while registring the new user'})
    }
})

router.route('/:id')
.get(async (req, res) => {
    const userID = Number(req.params.id);
    try {
        const getUser = await User.findOne({ ID: userID});
        if (getUser) {
            res.status(200).json(getUser);
        } else {
            res.status(404).json({ Error: `Person with id ${userID} doesn't exist` });
        }
    } catch (err) {
        console.error(`Error fetching the user details with id ${userID}`, err);
        res.status(500).json({ Error: 'Error occurred while retrieving the user details' });
    }
})
.delete(async (req, res) => {
    const userID = Number(req.params.id);
    try {
        const deletedUser = await User.findOneAndDelete({ ID: userID });
        if (deletedUser) {
            res.status(200).json({"Details of deleted user": deletedUser});
        } else {
            res.status(404).json({ Error: `User with id number ${userID} doesn't exist` });
        }
    } catch (err) {
        console.error(`Error deleting the user details with id ${userID}`, err);
        res.status(500).json({ Error: 'Error deleting the user details' });
    }
})
.patch(async (req, res) => {
    const userID = Number(req.params.id);
    try {
        const findUser = await User.findOne({ ID: userID });
        if (!findUser) {
            return res.status(404).json({ "Message": `User with id ${userID} doesn't exist` });
        }
        const body = req.body;
        const editedUser = {
            ID: userID,
            Name: body.Name ? body.Name : findUser.Name,
            Gender: body.Gender ? body.Gender : findUser.Gender,
            Country: body.Country ? body.Country : findUser.Country,
            Company: body.Company ? body.Company : findUser.Company,
            Credit_Card: body.Credit_Card ? body.Credit_Card : findUser.Credit_Card,
            Bank_Balance: body.Bank_Balance ? body.Bank_Balance : findUser.Bank_Balance,
        };
        const savedUser = await User.findOneAndUpdate({ ID: userID }, { $set: editedUser }, { new: true });
        res.status(200).json({ "Details of the user after update": savedUser });
    } catch (err) {
        console.error(`Error updating the user details with id ${userID}`, err);
        res.status(500).json({ Error: 'Error deleting the user details' });
    }
});

export default router