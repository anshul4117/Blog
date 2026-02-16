import redis from '../../config/redisClient.js';
import Blog from '../../models/blog.js';
import Like from '../../models/like.js';
import mongoose from 'mongoose';

const myblogs = async (req, res) => {
  const userId = req.user.userId;
  const cacheKey = `my_blogs:${userId}`;

  let cachedMyBlogs = null;
  try {
    cachedMyBlogs = await redis.get(cacheKey);
  } catch (error) {
    console.error('Redis Error (myblogs):', error.message);
    // Continue to DB fetch if Redis fails
  }

  if (cachedMyBlogs) {
    try {
      return res.status(200).json({
        message: 'Blogs fetched successfully (from cache)',
        length: JSON.parse(cachedMyBlogs).length,
        blogs: JSON.parse(cachedMyBlogs)
      });
    } catch (parseError) {
      // If JSON parse fails, ignore and fetch from DB
    }
  }

  try {

    const blogsWithLikes = await Blog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "likes", // must match MongoDB collection name
          let: { blogId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$blogId"] },
                    { $eq: ["$targetType", "Blog"] }
                  ]
                }
              }
            },
            {
              $count: "count"
            }
          ],
          as: "likeData"
        }
      },
      {
        $addFields: {
          likeCount: {
            $ifNull: [{ $arrayElemAt: ["$likeData.count", 0] }, 0]
          }
        }
      },
      {
        $project: {
          likeData: 0
        }
      },
      {
        $sort: { createdAt: -1 } // optional sorting
      }
    ]);

    try {
      await redis.set(cacheKey, JSON.stringify(blogsWithLikes), 'EX', 1800);
    } catch (cacheSetError) {
      console.error('Redis Set Error:', cacheSetError.message);
      // Data is fetched, just failed to cache. Proceed.
    }

    return res.status(200).json({
      message: 'Blogs fetched successfully',
      length: blogsWithLikes.length,
      blogs: blogsWithLikes
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

export default myblogs;
