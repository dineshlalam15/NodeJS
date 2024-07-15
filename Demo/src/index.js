import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
const mongoDB = process.env.MONGODB_URI;
const app = express();

(async () => {
    try {
        await mongoose.connect(mongoDB);
        app.on("Error", (error) => {
            console.error("Error", error);
            throw error
        })
        app.listen(port, () => {
            console.log(`Application running on PORT ${port}`);
        });
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
})();
