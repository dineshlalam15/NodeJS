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

app.set("view engine", 'ejs');
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(express.json())
app.use('/url', URLRouter);


app.get('/test', async (req, res) => {
    const allURLs = await URLModel.find({});
    return res.end(`
        <html>
            <head></head>
            <body>
                <ol>
                ${allURLs.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`).join('')}
                </ol>
            </body>
        </html>
    `)
})

app.get('/:shortid', async(req, res) => {
    const shortId = req.params.shortid;
    console.log(shortId)
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
    console.log(entry.redirectURL)
    return res.status(200).redirect(entry.redirectURL);
});