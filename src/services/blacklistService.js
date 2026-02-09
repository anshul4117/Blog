import redis from '../config/redisClient.js';
import config from '../config/index.js';

const blacklistService = {

    async addToBlacklist(token, expirySeconds = 900) { // Default 15m
        const key = `blacklist:${token}`;
        await redis.set(key, '1', 'EX', expirySeconds);
    },

    async isBlacklisted(token) {
        const key = `blacklist:${token}`;
        const result = await redis.get(key);
        return result === '1';
    }
};

export default blacklistService;
