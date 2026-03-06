import Blog from '../models/blog.js';
import APIFeatures from '../utils/apiFeatures.js';
import redis from '../config/redisClient.js';
import logger from '../config/logger.js';
import { registerCacheKey } from '../utils/helper/cacheHelper.js';

const blogService = {

    //  Get all blogs with caching, filtering, and pagination

    async getAllBlogs(query) {
        // 1. Generate a unique cache key based on the query parameters
        // If query is empty, it's the default feed.
        const queryString = JSON.stringify(query);
        const cacheKey = `all_blogs:${queryString}`;

        try {
            // 2. Try to get from cache
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                logger.info('🟢 Cache Hit: Blogs');
                return JSON.parse(cachedData);
            }
        } catch (err) {
            logger.error('❌ Redis Get Error:', err);
            // Fail safely: If Redis fails, continue to DB
        }

        // 3. If miss, query MongoDB using APIFeatures
        const features = new APIFeatures(Blog.find().populate('userId', 'name email'), query)
            .search()
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const blogs = await features.query;

        // Get total count for pagination metadata
        const totalBlogs = await Blog.countDocuments();

        const result = {
            blogs,
            totalBlogs,
            page: features.page,
            limit: features.limit,
            totalPages: Math.ceil(totalBlogs / features.limit)
        };

        // 4. Update Cache (30 min TTL)
        try {
            if (blogs.length > 0) {
                await redis.setex(cacheKey, 1800, JSON.stringify(result));
                await registerCacheKey(cacheKey); // Track for O(1) invalidation
            }
        } catch (err) {
            logger.error('❌ Redis Set Error:', err);
        }

        return result;
    }
};

export default blogService;
