import Comment from '../models/comment.js';
import Blog from '../models/blog.js';
import AppError from '../utils/AppError.js';
import { invalidateAllBlogsCache, invalidateUserBlogs } from '../utils/helper/cacheHelper.js';

const commentService = {
    /**
     * Create a comment on a blog
     */
    async createComment({ userId, blogId, content }) {
        const blog = await Blog.findById(blogId);
        if (!blog) throw new AppError('Blog not found', 404);

        const newComment = await Comment.create({
            userId,
            blogId,
            content
        });

        // Invalidate blog caches (comment count changed)
        await invalidateAllBlogsCache();
        await invalidateUserBlogs(blog.userId);

        return await newComment.populate('userId', 'name username profilePicture');
    },

    /**
     * Get comments for a blog (paginated)
     */
    async getCommentsByBlog(blogId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const comments = await Comment.find({
            blogId,
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name username profilePicture')
            .lean();

        const total = await Comment.countDocuments({ blogId, isDeleted: false });

        return {
            results: comments,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    },

    /**
     * Delete comment (soft delete)
     */
    async deleteComment(commentId, userId) {
        const comment = await Comment.findById(commentId);
        if (!comment) throw new AppError('Comment not found', 404);

        if (comment.userId.toString() !== userId) {
            throw new AppError('Not authorized to delete this comment', 403);
        }

        comment.isDeleted = true;
        await comment.save();

        // Invalidate blog caches (comment count changed)
        const blog = await Blog.findById(comment.blogId);
        if (blog) {
            await invalidateAllBlogsCache();
            await invalidateUserBlogs(blog.userId);
        }

        return { message: 'Comment deleted successfully' };
    },

    /**
     * Edit comment
     */
    async updateComment(commentId, userId, content) {
        const comment = await Comment.findById(commentId);
        if (!comment) throw new AppError('Comment not found', 404);

        if (comment.userId.toString() !== userId) {
            throw new AppError('Not authorized to edit this comment', 403);
        }

        if (comment.isDeleted) {
            throw new AppError('Cannot edit a deleted comment', 400);
        }

        comment.content = content;
        await comment.save();
        return comment;
    }
};

export default commentService;
