import redis from '../../config/redisClient.js';
import Blog from '../../models/blog.js';

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const userId = req.user.userId;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and Content are required',
      });
    }

    // Build blog data
    const blogData = {
      title,
      content,
      userId,
      published: true,
    };

    // Handle optional image upload
    if (req.file) {
      blogData.image = {
        url: req.file.path,       // Cloudinary URL
        publicId: req.file.filename // Cloudinary public_id for deletion
      };
    }

    const newBlog = new Blog(blogData);
    await newBlog.save();

    // Invalidate cache
    await redis.del('all_blogs');
    await redis.del('my_blogs:' + userId);

    return res.status(201).json({
      message: 'Blog created successfully',
      blog: newBlog
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error creating blog',
      error: error.message
    });
  }
};
export default createBlog;