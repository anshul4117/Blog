import Like from '../models/like.js';
import Blog from '../models/blog.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

const likeService = {
    /**
     * Toggle like status (Like if not liked, Unlike if already liked)
     * @param {string} userId 
     * @param {string} targetId 
     * @param {string} targetType 
     * @returns {Object} { status: 'liked' | 'unliked' }
     */
    async toggleLike(userId, targetId, targetType) {
        // 1. Validate Target Exists
        if (targetType === 'Blog') {
            const blog = await Blog.findById(targetId);
            if (!blog) throw new AppError('Blog not found', 404);
        }
        // Add logic for 'Comment' here later

        // 2. Check if already liked
        const existingLike = await Like.findOne({ userId, targetId, targetType });

        if (existingLike) {
            // Unlike
            await Like.findByIdAndDelete(existingLike._id);
            logger.info(`User ${userId} unliked ${targetType} ${targetId}`);
            return { status: 'unliked' };
        } else {
            // Like
            const newLike = await Like.create({ userId, targetId, targetType });
            logger.info(`User ${userId} liked ${targetType} ${targetId}`);
            return { status: 'liked', likedAt: newLike.createdAt };
        }
    },

    /**
     * Get total likes for a target
     */
    async getLikeCount(targetId, targetType) {
        return await Like.countDocuments({ targetId, targetType });
    },

    /**
     * Check if user liked a target
     */
    async checkIsLiked(userId, targetId, targetType) {
        const like = await Like.exists({ userId, targetId, targetType });
        return !!like;
    }
};

export default likeService;
