const mongoose = require('mongoose')
const personSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Gender: String,
    Place: String,
    Industry: String,
    Vehicle: String
})
const person = mongoose.model('person', personSchema)
module.exports = person