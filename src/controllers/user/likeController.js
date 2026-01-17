import likeService from '../../services/likeService.js';

const likeController = {
    async toggleLike(req, res, next) {
        try {
            const userId = req.user.userId; // Ensure we use correct ID field from token
            const { targetId, targetType } = req.body;

            if (!targetId || !targetType) {
                return res.status(400).json({ message: 'targetId and targetType are required' });
            }

            const result = await likeService.toggleLike(userId, targetId, targetType);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getLikeStatus(req, res, next) {
        try {
            const userId = req.user?.userId; // Optional: Works for unauthenticated too? No, usually authenticated for "isLiked"
            const { targetId, targetType } = req.query;

            if (!targetId || !targetType) {
                return res.status(400).json({ message: 'targetId and targetType are required' });
            }

            const count = await likeService.getLikeCount(targetId, targetType);
            let isLiked = false;

            if (userId) {
                isLiked = await likeService.checkIsLiked(userId, targetId, targetType);
            }

            res.status(200).json({
                status: 'success',
                data: {
                    count,
                    isLiked
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

export default likeController;
