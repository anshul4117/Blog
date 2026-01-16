import express from 'express';
import followController from '../controllers/user/followController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Protected Routes (Require Login)
router.post('/:id/follow', auth, followController.follow);
router.delete('/:id/follow', auth, followController.unfollow);

// Public Routes (Anyone can see followers/following)
// Optionally make these protected if you want privacy
router.get('/:id/followers', followController.getFollowers);
router.get('/:id/following', followController.getFollowing);

export default router;
