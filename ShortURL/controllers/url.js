const shortid = require('shortid');
const URLModel = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
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
    console.log(`Generated shortId: ${shortId}`);
    return res.json({ id: shortId });
}

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortid;
        console.log('shortId:', shortId);
        if (!shortId) {
            return res.status(400).json({ error: 'shortId parameter is required' });
        }
        const result = await URLModel.findOne({ shortId });
        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { 
    handleGenerateNewShortURL,
    handleGetAnalytics,
 };