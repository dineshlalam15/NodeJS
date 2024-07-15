import connectDB from './db/index.js';
import connectServer from './connection.js';
connectDB();
connectServer();

// (async () => {
//     try {
//         await mongoose.connect(mongoDB);
//         app.on("Error", (error) => {
//             console.error("Error", error);
//             throw error
//         })
//         app.listen(port, () => {
//             console.log(`Application running on PORT ${port}`);
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         throw error;
//     }
// })();
