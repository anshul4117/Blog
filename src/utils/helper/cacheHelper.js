import redis from '../../config/redisClient.js';

const CACHE_REGISTRY = 'cache_registry:all_blogs';

/**
 * Register a cache key so we can find it later for invalidation.
 * Called by blogService when setting cache.
 */
const registerCacheKey = async (key) => {
  try {
    await redis.sadd(CACHE_REGISTRY, key);
  } catch (err) {
    console.error('Cache Register Error:', err.message);
  }
};

/**
 * Invalidate ALL "all_blogs" cache keys using the registry.
 * O(1) lookup via SMEMBERS instead of O(N) KEYS scan.
 */
const invalidateAllBlogsCache = async () => {
  try {
    const keys = await redis.smembers(CACHE_REGISTRY);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    await redis.del(CACHE_REGISTRY);
  } catch (err) {
    console.error('Cache Invalidation Error (allBlogs):', err.message);
  }
};

/**
 * Invalidate a specific user's "my_blogs" cache.
 */
const invalidateUserBlogs = async (userId) => {
  try {
    await redis.del(`my_blogs:${userId}`);
  } catch (err) {
    console.error('Cache Invalidation Error (myBlogs):', err.message);
  }
};

export { invalidateAllBlogsCache, invalidateUserBlogs, registerCacheKey };
