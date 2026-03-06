import Like from '../models/like.js';
import Blog from '../models/blog.js'; // Needed to find owner
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';
import redisHelper from '../utils/helper/redisHelper.js';

const likeService = {

    async toggleLike(userId, targetId, targetType) {
        let blog = null;

        // 1. Validate Target Exists (and save reference for cache update)
        if (targetType === 'Blog') {
            blog = await Blog.findById(targetId);
            if (!blog) throw new AppError('Blog not found', 404);
        }

        // 2. Check if already liked
        const existingLike = await Like.findOne({ userId, targetId, targetType });

        // 3. Un-Like logic
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            // Smart Cache Update (-1) — reuse `blog` from step 1
            if (blog) {
                await redisHelper.updateMyBlogsCache(blog.userId, targetId, -1);
            }
            logger.info(`User ${userId} unliked ${targetType} ${targetId}`);
            return { status: 'unliked' };
        }

        // 4. Like logic
        const newLike = await Like.create({ userId, targetId, targetType });
        // Smart Cache Update (+1) — reuse `blog` from step 1
        if (blog) {
            await redisHelper.updateMyBlogsCache(blog.userId, targetId, 1);
        }
        logger.info(`User ${userId} liked ${targetType} ${targetId}`);
        return { status: 'liked', likedAt: newLike.createdAt };
    },

    async getLikeCount(targetId, targetType) {
        return await Like.countDocuments({ targetId, targetType });
    },

    async checkIsLiked(userId, targetId, targetType) {
        const like = await Like.exists({ userId, targetId, targetType });
        return !!like;
    }
};

export default likeService;
