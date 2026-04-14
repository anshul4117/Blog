import Bookmark from '../models/bookmark.js';
import Blog from '../models/blog.js';
import AppError from '../utils/AppError.js';

const bookmarkService = {
    /**
     * Toggle bookmark (save/unsave)
     */
    async toggleBookmark(userId, blogId) {
        const blog = await Blog.findById(blogId);
        if (!blog) throw new AppError('Blog not found', 404);

        const existing = await Bookmark.findOne({ userId, blogId });

        if (existing) {
            await Bookmark.findByIdAndDelete(existing._id);
            return { status: 'removed' };
        }

        await Bookmark.create({ userId, blogId });
        return { status: 'saved' };
    },

    /**
     * Get user's bookmarked blogs (paginated)
     */
    async getMyBookmarks(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const bookmarks = await Bookmark.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'blogId',
                populate: { path: 'userId', select: 'name email' }
            })
            .lean();

        const total = await Bookmark.countDocuments({ userId });

        return {
            bookmarks: bookmarks.map(b => b.blogId),
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    },

    /**
     * Check if a blog is bookmarked
     */
    async isBookmarked(userId, blogId) {
        const exists = await Bookmark.exists({ userId, blogId });
        return !!exists;
    }
};

export default bookmarkService;
