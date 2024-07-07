const mongoose = require('mongoose')
mongoose.set("strictQuery", true);
async function connectToMongoDB(uri){
    return mongoose.connect(uri)
}
module.exports = {
    connectToMongoDB,
};