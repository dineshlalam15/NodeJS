const mongoose = require('mongoose')
const personSchema = new mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Gender: { type: String, required: true },
    Place: { type: String, required: true },
    Industry: { type: String, required: true },
    Vehicle: { type: String, required: true }
})
const person = mongoose.model('person', personSchema)
module.exports = person