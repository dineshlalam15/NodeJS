import mongoose from "mongoose";
const patientSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        diagnosis:{
            rype: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        age:{
            type: Number,
            required: true
        },
        gender:{
            type: String, 
            enum: ["Male", "Female", "Prefer not to say"],
            required: true
        },
        admitted:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        }
    }, {timestamps: true}
)
export const Patient = mongoose.model("Patient", patientSchema)
