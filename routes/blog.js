import express from 'express';
import createBlog from '../controllers/blog/create.js';
import auth from '../middleware/auth.js';
import allBlogs from '../controllers/blog/allblogs.js';
const router = express.Router();

router.post('/create', auth,createBlog);
router.get('/allblogs', auth,allBlogs);
router.get('/del-blog', auth);
router.get('/up-blog',auth);

export default router;  