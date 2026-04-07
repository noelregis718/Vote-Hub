const express = require('express');
const router = express.Router();

// Alpha Vantage API Configuration from .env
const ALPHAVANTAGE_KEY = process.env.ALPHAVANTAGE_KEY;
// We use broader topics to ensure a rich "Trending" feed for the platform hub
const TOPICS = 'technology,blockchain,finance,ipo';
const ALPHAVANTAGE_URL = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${TOPICS}&limit=10&apikey=${ALPHAVANTAGE_KEY}`;

// Proxy Alpha Vantage fetch to avoid CORS issues and secure the API key
router.get('/', async (req, res) => {
    try {
        const response = await fetch(ALPHAVANTAGE_URL);
        const data = await response.json();
        
        // Alpha Vantage returns news in a "feed" array
        if (data.feed) {
            res.json({
                status: 'success',
                articles: data.feed,
                metadata: {
                    items: data.items,
                    sentiment_score_definition: data.sentiment_score_definition
                }
            });
        } else if (data.Note || data['Error Message'] || data.Information) {
            const msg = data.Note || data.Information || data['Error Message'];
            res.status(429).json({
                status: 'error',
                message: msg ? `Alpha Vantage: ${msg}` : 'Rate Limit reached. Wait a minute.'
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch news from Alpha Vantage'
            });
        }
    } catch (error) {
        console.error('Backend Alpha Vantage Proxy Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching news'
        });
    }
});

module.exports = router;
