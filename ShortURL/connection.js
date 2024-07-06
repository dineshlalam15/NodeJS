const mongoose = require('mongoose')

function connectToMongoDB(ConnectionURI){
    return mongoose.connect(ConnectionURI)
}
module.exports = {
    connectToMongoDB,
};