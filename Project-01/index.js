import dotenv from 'dotenv'
dotenv.config();
import {connectMongoDB, connectPort} from './connection.js';
import app from './app.js'
import router from './methods.js';

app.use('/users', router)

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 8000;

connectMongoDB(uri).then(() => {
    connectPort(port)
}).catch(error => {
    console.error(`Connection Error | ${error}`);
    process.exit(1)
})