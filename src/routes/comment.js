import express from 'express';
import commentController from '../controllers/comment/commentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public Routes (Reading comments)
router.get('/blog/:blogId', commentController.getBlogComments);
router.get('/replies/:commentId', commentController.getReplies);

// Protected Routes (Writing comments)
router.post('/create', auth, commentController.createComment);
router.patch('/:id', auth, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);

export default router;
