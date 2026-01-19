import Comment from '../models/comment.js';
import Blog from '../models/blog.js';
import User from '../models/user.js';
import AppError from '../utils/AppError.js';

const commentService = {
    /**
     * Create a comment or reply
     */
    async createComment({ userId, blogId, content, parentId = null }) {
        // 1. Verify Blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) throw new AppError('Blog not found', 404);

        // 2. Verify Parent Comment exists (if reply)
        if (parentId) {
            const parent = await Comment.findById(parentId);
            if (!parent) throw new AppError('Parent comment not found', 404);
            // Optional: Ensure parent belongs to same blog?
            if (parent.blogId.toString() !== blogId) {
                throw new AppError('Parent comment does not belong to this blog', 400);
            }
        }

        const newComment = await Comment.create({
            userId,
            blogId,
            content,
            parentId
        });

        // Return populated comment
        return await newComment.populate('userId', 'name username profilePicture');
    },

    /**
     * Get Top-Level Comments for a Blog (Pagination)
     */
    async getCommentsByBlog(blogId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const comments = await Comment.find({
            blogId,
            parentId: null // Only top level
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name username profilePicture')
            .lean();

        // For each comment, get reply count
        const commentsWithCount = await Promise.all(comments.map(async (c) => {
            const replyCount = await Comment.countDocuments({ parentId: c._id });
            return { ...c, replyCount };
        }));

        const total = await Comment.countDocuments({ blogId, parentId: null });

        return {
            results: commentsWithCount,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    },

    /**
     * Get Replies for a Comment (Pagination)
     */
    async getReplies(commentId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const replies = await Comment.find({ parentId: commentId })
            .sort({ createdAt: 1 }) // Chronological for replies
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name username profilePicture')
            .lean();

        const repliesWithCount = await Promise.all(replies.map(async (r) => {
            const replyCount = await Comment.countDocuments({ parentId: r._id });
            return { ...r, replyCount };
        }));

        const total = await Comment.countDocuments({ parentId: commentId });

        return {
            results: repliesWithCount,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    },

    /**
     * Soft Delete Comment
     */
    async deleteComment(commentId, userId) {
        const comment = await Comment.findById(commentId);
        if (!comment) throw new AppError('Comment not found', 404);

        if (comment.userId.toString() !== userId) {
            throw new AppError('Not authorized to delete this comment', 403);
        }

        // Soft delete
        comment.isDeleted = true;
        await comment.save();
        return { message: 'Comment deleted successfully' };
    },

    /**
     * Edit Comment
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
