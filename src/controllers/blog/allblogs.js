import blogService from '../../services/blogService.js';

const allBlogs = async (req, res, next) => {
  try {
    // Delegate to Service Layer (Handles Caching & DB)
    const blogs = await blogService.getAllBlogs(req.query);

    // Send Response
    res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: {
        blogs,
      }
    });
  } catch (error) {
    next(error);
  }
};

export default allBlogs;
