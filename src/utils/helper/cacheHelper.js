// utils/cacheHelper.js
import redis from '../../config/redisClient.js';

const invalidateUserBlogs = async (userId) => {
  await redis.del(`my_blogs:${userId}`);
};

const updateAllBlogsCacheAfterDelete = async (deletedBlogId) => {
  const allBlogsKey = 'all_blogs';
  const cachedAllBlogs = await redis.get(allBlogsKey);
  if (!cachedAllBlogs) return;

  const blogs = JSON.parse(cachedAllBlogs).filter(b => b._id !== deletedBlogId);
  await redis.set(allBlogsKey, JSON.stringify(blogs), 'EX', 1800);
};

export { invalidateUserBlogs, updateAllBlogsCacheAfterDelete };
