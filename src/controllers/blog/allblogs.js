import Blog from '../../models/blog.js';
import APIFeatures from '../../utils/apiFeatures.js';

const allBlogs = async (req, res, next) => {
  try {
    // Execute Query
    const features = new APIFeatures(Blog.find().populate('userId', 'name email'), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const blogs = await features.query;

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
