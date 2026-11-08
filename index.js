
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { searchSong, songInfo } = require('./lib/scraper');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'madusanka_secret_123';

function auth(req, res, next) {
    const key = req.headers['x-api-key'] || req.query.apikey;

    if (key !== API_KEY) {
        return res.status(401).json({
            success: false,
            error: 'Invalid API Key'
        });
    }

    next();
}

app.get('/', (req, res) => {
    res.json({
        name: 'MADUSANKA SONG API',
        version: '1.0.0',
        status: 'online',
        endpoints: [
            '/api/v1/song/search?q=',
            '/api/v1/song/info?url=',
            '/api/v1/spotify/search?q='
        ]
    });
});

app.get('/api/v1/song/search', async (req, res) => {
    try {
        const q = req.query.q;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Song name required'
            });
        }

        const results = await searchSong(q);

        res.json({
            success: true,
            creator: 'MADUSANKA',
            results
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/v1/song/info', auth, async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'YouTube URL required'
            });
        }

        const result = await songInfo(url);

        res.json({
            success: true,
            creator: 'MADUSANKA',
            result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/v1/spotify/search', auth, (req, res) => {
    res.status(503).json({
        success: false,
        error: 'Configure Spotify API credentials to enable this endpoint.'
    });
});

app.get('/health', (req, res) => {
    res.json({ success: true, status: 'online' });
});

app.listen(PORT, () => {
    console.log(`MADUSANKA SONG API running on ${PORT}`);
});
