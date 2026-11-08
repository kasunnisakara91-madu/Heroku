
const yts = require('yt-search');
const axios = require('axios');

async function searchSong(query) {
    const result = await yts(query);

    return result.videos.slice(0, 10).map(song => ({
        title: song.title,
        videoId: song.videoId,
        url: song.url,
        thumbnail: song.thumbnail,
        duration: song.timestamp,
        views: song.views,
        author: song.author.name
    }));
}

async function songInfo(url) {
    const result = await yts({ videoId: extractId(url) });

    if (!result) throw new Error('Song not found');

    return {
        title: result.title,
        url: result.url,
        thumbnail: result.thumbnail,
        duration: result.timestamp,
        views: result.views,
        author: result.author.name
    };
}

function extractId(url) {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtu.be')) {
            return parsed.pathname.slice(1);
        }
        return parsed.searchParams.get('v');
    } catch {
        return null;
    }
}

module.exports = { searchSong, songInfo };
