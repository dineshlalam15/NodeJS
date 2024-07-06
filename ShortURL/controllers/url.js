const shortid = require('shortid');
const URLModel = require("../models/url");

async function generateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: "URL is required" });
    }
    const shortId = shortid.generate();
    await URLModel.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
    });
    return res.json({ id: shortId });
}

module.exports = { generateNewShortURL };