const express = require('express');
const {connectToMongoDB} = require('./connection.js');
const URLRouter = require('./routes/url.js');
const URLModel = require('./models/url.js')
require('dotenv').config();

const app = express();
const port = 8001;

const ConnectionURI = process.env.uri;
connectToMongoDB(ConnectionURI)
.then(() => {
    app.listen(port, () => {
        console.log(`Server started at PORT ${port}`);
    });
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

app.use(express.json())
app.use('/url', URLRouter);

app.get('/:shortid', async(req, res) => {
    const shortId = req.params.shortid;
    const entry = await URLModel.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
    );
    console.log("Redirected URL:",entry.redirectURL);
    return res.status(302).redirect(entry.redirectURL);
});