import express from 'express';
import createUser from '../controllers/user/createUser.js';
import loginUser from '../controllers/user/loginUser.js';
import allUsers from '../controllers/user/getAllUsers.js';
import auth from '../middleware/auth.js';
import updateProfile from '../controllers/user/updateProfile.js';
import { userProfile } from '../controllers/user/details/profile.js';
import { changePassword } from '../controllers/user/service/changePassword.js';
import refreshToken from '../controllers/user/refreshToken.js';
import logoutUser from '../controllers/user/logoutUser.js';
import deleteProfilePicture from '../controllers/user/deleteProfilePicture.js';
const router = express.Router();

import { validateRequest } from '../middleware/validateRequest.js';
import { registerUserSchema, loginUserSchema } from '../validators/userValidator.js';
import { authLimiter } from '../middleware/rateLimiter.js';

import { upload } from '../middleware/upload.js';

router.post('/create', validateRequest(registerUserSchema), createUser);
router.post('/login', authLimiter, validateRequest(loginUserSchema), loginUser);
router.get('/allUsers', auth, allUsers);
router.patch('/edit-user/:id', auth, upload.single('profilePicture'), updateProfile);
router.get('/profile', auth, userProfile);
router.patch('/change-password', auth, changePassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.delete('/profile-picture', auth, deleteProfilePicture);

export default router;