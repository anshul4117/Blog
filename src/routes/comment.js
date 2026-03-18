import express from 'express';
import commentController from '../controllers/comment/commentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get('/blog/:blogId', commentController.getBlogComments);

// Protected Routes
router.post('/create', auth, commentController.createComment);
router.patch('/:id', auth, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);

export default router;
