const express = require('express');
const { generateNewShortURL } = require('../controllers/url.js');
const URLModel = require('../models/url.js');
const router = express.Router();

router.post('/', generateNewShortURL);

router.get('/:shortid', async (req, res) => {
    try {
        const shortId = req.params.shortid;
        const entry = await URLModel.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true }
        );
        if (!entry) {
            return res.status(404).send(`Short ID ${shortId} not found`);
        }
        console.log(entry); // DEBUGGING
        res.status(200).send(entry.redirectURL);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;