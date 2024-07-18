import connectDB from './db/connection.js';
import connectServer from './connection.js';

connectDB().then(() => {
    connectServer()
}).catch((error) => {
    console.error("Database Connection Failed", error);
    process.exit(1)
})