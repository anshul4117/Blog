import Follow from '../models/follow.js';
import User from '../models/user.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

const followService = {
    /**
     * Follow a user
     * @param {string} followerId - ID of the user performing the action
     * @param {string} targetUserId - ID of the user to follow
     */
    async followUser(followerId, targetUserId) {
        if (followerId === targetUserId) {
            throw new AppError('You cannot follow yourself', 400);
        }

        // Check if target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            throw new AppError('User not found', 404);
        }

        // Check if already following (handled by DB index mostly, but good for custom error)
        const existingFollow = await Follow.findOne({ followerId, followingId: targetUserId });
        if (existingFollow) {
            throw new AppError('You are already following this user', 400);
        }

        await Follow.create({ followerId, followingId: targetUserId });
        logger.info(`User ${followerId} followed ${targetUserId}`);
    },

    /**
     * Unfollow a user
     * @param {string} followerId 
     * @param {string} targetUserId 
     */
    async unfollowUser(followerId, targetUserId) {
        const result = await Follow.findOneAndDelete({ followerId, followingId: targetUserId });

        if (!result) {
            throw new AppError('You are not following this user', 400);
        }
        logger.info(`User ${followerId} unfollowed ${targetUserId}`);
    },

    /**
     * Get list of followers for a user
     * @param {string} userId 
     * @param {number} page 
     * @param {number} limit 
     */
    async getFollowers(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const followers = await Follow.find({ followingId: userId })
            .skip(skip)
            .limit(limit)
            .populate('followerId', 'name username profilePicture bio')
            .lean();

        const total = await Follow.countDocuments({ followingId: userId });

        return {
            results: followers.map(f => f.followerId), // Flatten structure
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    },

    /**
     * Get list of following
     */
    async getFollowing(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const following = await Follow.find({ followerId: userId })
            .skip(skip)
            .limit(limit)
            .populate('followingId', 'name username profilePicture bio')
            .lean();

        const total = await Follow.countDocuments({ followerId: userId });

        return {
            results: following.map(f => f.followingId), // Flatten structure
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }
};

export default followService;
