import Blog from '../../models/blog.js';

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404)
                .json({
                    message: "Blog not found"
                })
        };
        return res.status(200)
            .json({
                message: "Blog fetched successfully",
                blog
            });

    } catch (error) {
        return res.status(500)
            .json({
                message: "Error fetching a blog",
                error: error.message
            })
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404)
                .json({
                    message: "Blog not found"
                })
        }
        return res.status(200)
            .json({
                message: "Blog deleted successfully",
                blog
            });

    } catch (error) {
        return res.status(500)
            .json({
                message: "Error deleting a blog",
                error: error.message
            })
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;
        const blog = await Blog
            .findByIdAndUpdate(id, { title, content, author }, { new: true });
        if (!blog) {
            return res.status(404)
                .json({
                    message: "Blog not found"
                })
        }
        return res.status(200)
            .json({
                message: "Blog updated successfully",
                blog
            });
    } catch (error) {
        return res.status(500)
            .json({
                message: "Error updating a blog",
                error: error.message
            })
    }
}

export { getBlogById, deleteBlog, updateBlog };