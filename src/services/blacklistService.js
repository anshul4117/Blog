import redis from '../config/redisClient.js';
import config from '../config/index.js';

const blacklistService = {
    /**
     * Add token to blacklist with expiry
     * @param {string} token - The access token to blacklist
     * @param {number} expirySeconds - Time until token natural expiry
     */
    async addToBlacklist(token, expirySeconds = 900) { // Default 15m
        const key = `blacklist:${token}`;
        await redis.set(key, '1', 'EX', expirySeconds);
    },

    /**
     * Check if token is blacklisted
     * @param {string} token 
     * @returns {boolean}
     */
    async isBlacklisted(token) {
        const key = `blacklist:${token}`;
        const result = await redis.get(key);
        return result === '1';
    }
};

export default blacklistService;
