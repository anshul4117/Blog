import express from 'express';
import likeController from '../controllers/user/likeController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Toggle like (Requires Auth)
router.post('/toggle', auth, likeController.toggleLike);

// Get status (Auth optional but here we force it for isLiked check simplicity first, 
// or we can make a middleware that blindly attaches user if present without throwing)
// For now, let's keep it protected to check "isLiked"
router.get('/status', auth, likeController.getLikeStatus);

export default router;
