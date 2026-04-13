import Blog from '../../models/blog.js';
import cloudinary from '../../config/cloudinary.js';
import { invalidateAllBlogsCache, invalidateUserBlogs } from '../../utils/helper/cacheHelper.js';

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json({
      message: 'Blog fetched successfully',
      blog
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching a blog',
      error: error.message
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Step 1: Find the blog FIRST (don't delete yet)
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Step 2: Ownership check
    if (blog.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own blogs' });
    }

    // Step 3: Now safe to delete
    await Blog.findByIdAndDelete(id);

    // Step 4: Cleanup Cloudinary image
    if (blog.image && blog.image.publicId) {
      try {
        await cloudinary.uploader.destroy(blog.image.publicId);
      } catch (cloudErr) {
        console.error('Cloudinary delete error:', cloudErr.message);
      }
    }

    // Step 5: Invalidate caches
    await invalidateUserBlogs(userId);
    await invalidateAllBlogsCache();

    return res.status(200).json({
      message: 'Blog deleted successfully',
      blog
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting a blog',
      error: error.message
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Step 1: Find the blog FIRST
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Step 2: Ownership check
    if (blog.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit your own blogs' });
    }

    // Step 3: Now safe to update
    const { title, content } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;
    await blog.save();

    // Step 4: Invalidate caches
    await invalidateUserBlogs(userId);
    await invalidateAllBlogsCache();

    return res.status(200).json({
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating a blog',
      error: error.message
    });
  }
};

export { getBlogById, deleteBlog, updateBlog };