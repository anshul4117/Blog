import express from 'express';
import createUser from '../controllers/user/createUser.js';
import loginUser from '../controllers/user/loginUser.js';
import allUsers from '../controllers/user/getAllUsers.js';

const router = express.Router();

router.post('/create', createUser);
router.get('/login', loginUser);
router.get('/allUsers', allUsers);

export default router;