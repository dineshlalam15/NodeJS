import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema({
    subscribers: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const Subscription = model('Subscription', subscriptionSchema)
export default Subscription