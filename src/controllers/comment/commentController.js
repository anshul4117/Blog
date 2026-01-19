import commentService from '../../services/commentService.js';

const commentController = {
    async createComment(req, res, next) {
        try {
            const userId = req.user.userId;
            const { blogId, content, parentId } = req.body;

            const comment = await commentService.createComment({
                userId,
                blogId,
                content,
                parentId
            });

            res.status(201).json({
                status: 'success',
                data: comment
            });
        } catch (error) {
            next(error);
        }
    },

    async getBlogComments(req, res, next) {
        try {
            const { blogId } = req.params;
            const { page, limit } = req.query;

            const result = await commentService.getCommentsByBlog(blogId, page, limit);

            res.status(200).json({
                status: 'success',
                ...result
            });
        } catch (error) {
            next(error);
        }
    },

    async getReplies(req, res, next) {
        try {
            const { commentId } = req.params;
            const { page, limit } = req.query;

            const result = await commentService.getReplies(commentId, page, limit);

            res.status(200).json({
                status: 'success',
                ...result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteComment(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const result = await commentService.deleteComment(id, userId);

            res.status(200).json({
                status: 'success',
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    },

    async updateComment(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { content } = req.body;

            const updatedComment = await commentService.updateComment(id, userId, content);

            res.status(200).json({
                status: 'success',
                data: updatedComment
            });
        } catch (error) {
            next(error);
        }
    }
};

export default commentController;
