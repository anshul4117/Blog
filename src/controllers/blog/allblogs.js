import blogService from '../../services/blogService.js';

const allBlogs = async (req, res, next) => {
  try {
    const result = await blogService.getAllBlogs(req.query);

    res.status(200).json({
      status: 'success',
      results: result.blogs.length,
      totalBlogs: result.totalBlogs,
      page: result.page,
      totalPages: result.totalPages,
      data: {
        blogs: result.blogs,
      }
    });
  } catch (error) {
    next(error);
  }
};

export default allBlogs;
