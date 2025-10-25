import redis from '../../config/redisClient.js'
import Blog from "../../models/blog.js";

const myblogs = async(req,res)=>{
    const cacheKey = "my_blogs";

    const cachedMyBlogs = await redis.get(cacheKey);
    if(cachedMyBlogs){
        console.log("📦 Serving from cache")
        return res.status(200).json({
            message: "Blogs fetched successfully (from cache)",
            blogs: JSON.parse(cachedMyBlogs)
        });
    }
    const userId = req.user.userId;
        try {
        const blogs = await Blog.find({
            userId: userId
        });

        await redis.set(cacheKey, JSON.stringify(blogs),'EX',1800)
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