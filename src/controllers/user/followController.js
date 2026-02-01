import followService from '../../services/followService.js';

const followController = {
    async follow(req, res, next) {
        try {

            const followerId = req.user.id;
            const targetUserId = req.params.id;

            await followService.followUser(followerId, targetUserId);

            res.status(200).json({
                status: 'success',
                message: 'User followed successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async unfollow(req, res, next) {
        try {
            const followerId = req.user.userId;
            const targetUserId = req.params.id;

            await followService.unfollowUser(followerId, targetUserId);

            res.status(200).json({
                status: 'success',
                message: 'User unfollowed successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async getFollowers(req, res, next) {
        try {
            const userId = req.params.id;
            const { page, limit } = req.query;

            const data = await followService.getFollowers(userId, page, limit);

            res.status(200).json({
                status: 'success',
                results: data.results.length,
                total: data.total,
                page: data.page,
                pages: data.pages,
                data: {
                    followers: data.results
                }
            });
        } catch (error) {
            next(error);
        }
    },

    async getFollowing(req, res, next) {
        try {
            const userId = req.params.id;
            const { page, limit } = req.query;

            const data = await followService.getFollowing(userId, page, limit);

            res.status(200).json({
                status: 'success',
                results: data.results.length,
                total: data.total,
                page: data.page,
                pages: data.pages,
                data: {
                    following: data.results
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

export default followController;
