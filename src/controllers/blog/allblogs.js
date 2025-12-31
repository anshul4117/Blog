import redis from "../../config/redisClient.js";
import Blog from "../../models/blog.js";

const allBlogs = async (req, res) => {
  try {
    const cacheKey = "all_blogs";

    // 1️⃣ Try getting data from Redis
    const cachedBlogs = await redis.get(cacheKey);
    if (cachedBlogs) {
      // console.log("📦 Serving from cache");
      return res.status(200).json({
        message: "Blogs fetched successfully (from cache)",
        length: JSON.parse(cachedBlogs).length,
        blogs: JSON.parse(cachedBlogs),
      });
    }

    // 2️⃣ If no cache, fetch from MongoDB
    const blogs = await Blog.find({})
      // .limit(10)
      .populate("userId", "name email");

    // 3️⃣ Store in Redis cache for 30 mins (1800 seconds)
    await redis.set(cacheKey, JSON.stringify(blogs), "EX", 1800);

    // 4️⃣ Return response
    return res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

export default allBlogs;
