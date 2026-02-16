import redis from '../../config/redisClient.js';

const redisHelper = {
    async updateMyBlogsCache(userId, blogId, increment) {
        try {
            const cacheKey = `my_blogs:${userId}`;
            const cachedData = await redis.get(cacheKey);

            if (cachedData) {
                const blogs = JSON.parse(cachedData);
                const blogIndex = blogs.findIndex(b => b._id.toString() === blogId.toString());

                if (blogIndex !== -1) {
                    // Safe update
                    let currentLikes = blogs[blogIndex].likeCount || 0;
                    blogs[blogIndex].likeCount = Math.max(0, currentLikes + increment); // Prevent negative

                    // Write back
                    await redis.set(cacheKey, JSON.stringify(blogs), 'EX', 1800);
                }
            }
        } catch (error) {
            console.error('Redis Helper Error:', error.message);
            // Fail silently so the main request doesn't crash and return perfect error
        }
    }
};

export default redisHelper;