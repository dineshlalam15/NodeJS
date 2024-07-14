import mongoose, { MongooseError } from "mongoose";
const doctorSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
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
        salary:{
            type: Number,
            required: true
        },
        Qualification:{
            type: String,
            required: true
        },
        experience:{
            type: Number, 
            default: 0
        },
        workPlaces:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hospital",
            }
        ]
    }, {timestamps: true}
)
export const Doctor = mongoose.model("Doctor", doctorSchema)