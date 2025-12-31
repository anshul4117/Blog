import express from 'express';
import createBlog from '../controllers/blog/create.js';
import auth from '../middleware/auth.js';
import allBlogs from '../controllers/blog/allblogs.js';
import { deleteBlog, getBlogById, updateBlog } from '../controllers/blog/blogs.js';
import myblogs from '../controllers/blog/myblogs.js';
const router = express.Router();

router.get('/allblogs', allBlogs);
router.post('/create', auth, createBlog);
router.get('/post/:id', auth, getBlogById);
router.get('/myblogs', auth, myblogs);
router.patch('/edit/:id', auth, updateBlog);
router.delete('/del-blog/:id', auth, deleteBlog);

export default router;  