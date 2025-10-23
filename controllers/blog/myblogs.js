import Blog from "../../models/blog.js";

const myblogs = async(req,res)=>{
    const userId = req.user.userId;
        try {
        const blogs = await Blog.find({
            userId: userId
        });
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
export default myblogs;