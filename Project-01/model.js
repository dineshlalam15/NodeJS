import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    ID: {
        type: Number,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    },
    Company: {
        type: String,
        required: true
    },
    Credit_Card: {
        type: String,
        required: true
    },
    Bank_Balance: {
        type: String,
        required: true
    }
})
const User = mongoose.model("User", userSchema, 'User_Details')

export default User