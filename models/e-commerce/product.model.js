import mongoose from "mongoose";
import { Category } from "./category.model";
const productSchema = new mongoose.Schema(
    {
        description:{
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        image:{
            type: String
        },
        price:{
            type: Number,
            default: 0
        },
        stock:{
            type: Number,
            default: 0
        },
        Category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }, {imestamps: true}
)
export const Product = mongoose.model('Product', productSchema)