import express from 'express';
import bookmarkService from '../services/bookmarkService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Toggle bookmark (save/unsave)
router.post('/toggle', auth, async (req, res, next) => {
    try {
        const { blogId } = req.body;
        const result = await bookmarkService.toggleBookmark(req.user.userId, blogId);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        next(error);
    }
});

// Get my bookmarks
router.get('/my', auth, async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await bookmarkService.getMyBookmarks(req.user.userId, page, limit);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        next(error);
    }
});

// Check if bookmarked
router.get('/check/:blogId', auth, async (req, res, next) => {
    try {
        const isBookmarked = await bookmarkService.isBookmarked(req.user.userId, req.params.blogId);
        res.status(200).json({ status: 'success', isBookmarked });
    } catch (error) {
        next(error);
    }
});

export default router;
