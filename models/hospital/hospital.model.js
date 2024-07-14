import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    line1: {
        type: String,
        required: true
    },
    line2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }
});
const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: addressSchema,
            required: true
        },
        specialization: {
            type: String, 
            default: "General"
        }
    }, 
    { timestamps: true }
);
export const Hospital = mongoose.model("Hospital", hospitalSchema);