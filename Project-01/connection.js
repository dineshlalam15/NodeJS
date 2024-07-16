import mongoose from 'mongoose';
import app from './app.js'

const connectMongoDB = async (uri) => {
    if (!uri) {
        console.error('Invalid Connection String');
        process.exit(1);
    }
    try {
        const connect = await mongoose.connect(uri);
        console.log(`MongoDB connected at ${connect.connection.host}`);
    } catch (err) {
        console.error('Connection Failed', err);
        process.exit(1);
    }
};

const connectPort = (port) => {
    if(!port){
        console.error(`Invalid Port`);
        process.exit(1)
    }
    app.listen(port, () => {
        console.log(`Running on PORT ${port}`);
    });
};

export { connectMongoDB, connectPort };