const mongoose = require('mongoose');

async function connectMongoDB(uri) {
    if (!uri) {
        console.log('URI is not defined in the environment variables');
        process.exit(1);
    }
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
        process.exit(1);
    }
}
module.exports = connectMongoDB;