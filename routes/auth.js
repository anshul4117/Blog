import express from 'express';
import createUser from '../controllers/user/createUser.js';
import loginUser from '../controllers/user/loginUser.js';
import allUsers from '../controllers/user/getAllUsers.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.get('/allUsers',auth, allUsers);

export default router;  