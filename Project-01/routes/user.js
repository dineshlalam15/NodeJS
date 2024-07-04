const express = require('express');
const dataModel = require('../models/user.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await dataModel.find({});
        res.json(data);
    } catch (err) {
        console.log('Error retrieving the data', err);
        res.status(500).json({ error: 'Error occurred while retrieving persons' });
    }
});

router.post('/newuser', async (req, res) => {
    const body = req.body;
    try {
        const lastUser = await dataModel.findOne().sort({ id: -1 });
        console.log(lastUser)
        const newUserId = lastUser ? lastUser.id + 1 : 1;
        const newUser = new dataModel({
            id: newUserId,
            FirstName: body.FirstName,
            LastName: body.LastName,
            gender: body.gender,
            email: body.email,
            Job: body.Job
        });
        console.log(newUser)
        const data = await newUser.save();
        res.status(201).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error occurred while saving a new user' });
    }
});

router.route('/:id')
    .get(async (req, res) => {
        const id = Number(req.params.id);
        try {
            const findUser = await dataModel.findOne({ id: id });
            if (findUser) {
                res.status(200).json(findUser);
            } else {
                res.status(404).json({ Error: `Person with id ${id} doesn't exist` });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ Error: 'Internal Server Error' });
        }
    })
    .delete(async (req, res) => {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ Error: "Invalid ID parameter" });
        }
        try {
            const deletedUser = await dataModel.findOneAndDelete({ id });
            if (deletedUser) {
                res.status(200).json({ User: deletedUser, Message: "User deleted successfully" });
            } else {
                res.status(404).json({ Error: `User with id number ${id} doesn't exist` });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ Error: err });
        }
    })
    .patch(async (req, res) => {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ Error: "Invalid ID parameter" });
        }
        try {
            const findUser = await dataModel.findOne({ id });
            if (!findUser) {
                return res.status(404).json({ "Message": `User with id ${id} doesn't exist` });
            }
            const body = req.body;
            const editedDetails = {
                FirstName: body.FirstName ? body.FirstName : findUser.FirstName,
                LastName: body.LastName ? body.LastName : findUser.LastName,
                gender: body.gender ? body.gender : findUser.gender,
                email: body.email ? body.email : findUser.email,
                Job: body.Job ? body.Job : findUser.Job
            };
            const editUser = await dataModel.findOneAndUpdate({ id }, { $set: editedDetails }, { new: true });
            res.status(200).json({ "Updated Details": editUser, "Message": "Details updated successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json("Internal Server Error");
        }
    });

module.exports = router;