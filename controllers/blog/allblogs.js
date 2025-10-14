import Blog from "../../models/blog.js";

const allBlogs = async(req,res)=>{
    try {
        const blogs = await Blog.find();
        return res.status(200)
        .json({
            message: "Blogs fetched successfully",
            blogs
        });
    } catch (error) {
        return res.status(500)
        .json({
            message: "Error fetching blogs",
            error: error.message
        })
    }
}
export default allBlogs;