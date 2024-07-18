import connectDB from './db/index.js';
import connectServer from './connection.js';

connectDB().then(() => {
    connectServer()
}).catch((error) => {
    console.error("Database Connection Failed");
    process.exit(1)
})