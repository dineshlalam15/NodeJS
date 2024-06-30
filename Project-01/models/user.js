const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    Job: {
        type: String,
        required: true
    }
});

const dataModel = mongoose.model('dataModel', userSchema, 'Data');

module.exports = dataModel;