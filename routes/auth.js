import express from 'express';
import createUser from '../controllers/user/createUser.js';
import loginUser from '../controllers/user/loginUser.js';
import allUsers from '../controllers/user/getAllUsers.js';
import auth from '../middleware/auth.js';
import updateProfile from '../controllers/user/updateProfile.js';
import { userProfile } from '../controllers/user/details/profile.js';
const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.get('/allUsers', auth, allUsers);
router.patch('/edit-user/:id', auth, updateProfile);
router.get('/profile', auth, userProfile);

export default router;  