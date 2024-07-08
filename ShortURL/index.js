const express = require('express');
const path = require('path');
const {connectToMongoDB} = require('./connection.js');
const URLRouter = require('./routes/url.js');
const staticRouter = require('./routes/staticRouter.js');
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

app.set("views", path.resolve("./views"));
app.set("view engine", 'ejs');
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/url', URLRouter);
app.use('/', staticRouter);

app.get('/:shortid', async(req, res) => {
    const shortId = req.params.shortid;
    console.log("shortId: ", shortId) // To Debug
    if(!shortId){
        return res.status(404).send(`shortId ${shortId} invalid`)
    }
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
    console.log("Original URL: ", entry.redirectURL) // To Debug
    return res.status(200).redirect(entry.redirectURL);
});