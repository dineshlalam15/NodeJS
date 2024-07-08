const express = require('express');
const { 
    handleGenerateNewShortURL,
    handleGetAnalytics,
} = require('../controllers/url.js');

const router = express.Router();

router.post('/', handleGenerateNewShortURL);
router.get('/analytics/:shortid', handleGetAnalytics);
module.exports = router;