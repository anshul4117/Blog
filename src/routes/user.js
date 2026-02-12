import express from 'express';
import auth from '../middleware/auth.js';
import updateProfile from '../controllers/user/updateProfile.js';
import { userProfile } from '../controllers/user/details/profile.js';
import { changePassword } from '../controllers/user/service/changePassword.js';

import deleteProfilePicture from '../controllers/user/deleteProfilePicture.js';
const router = express.Router();


import { upload } from '../middleware/upload.js';

router.patch('/update-user-profile', auth, upload.single('profilePicture'), updateProfile);
router.get('/profile', auth, userProfile);
router.patch('/change-password', auth, changePassword);
router.delete('/profile-picture', auth, deleteProfilePicture);

export default router;