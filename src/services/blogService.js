import Blog from '../models/blog.js';
import APIFeatures from '../utils/apiFeatures.js';
import redis from '../config/redisClient.js';
import logger from '../config/logger.js';
import { registerCacheKey } from '../utils/helper/cacheHelper.js';
import mongoose from 'mongoose';

const blogService = {

    async getAllBlogs(query) {
        const queryString = JSON.stringify(query);
        const cacheKey = `all_blogs:${queryString}`;

        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                logger.info('🟢 Cache Hit: Blogs');
                return JSON.parse(cachedData);
            }
        } catch (err) {
            logger.error('❌ Redis Get Error:', err);
        }

        // Build match conditions from query (search/filter)
        const matchConditions = {};
        if (query.search) {
            matchConditions.$text = { $search: query.search };
        }

        // Pagination
        const page = query.page * 1 || 1;
        const limit = query.limit * 1 || 10;
        const skip = (page - 1) * limit;

        // Sort
        let sortStage = { createdAt: -1 };
        if (query.sort) {
            const sortFields = query.sort.split(',');
            sortStage = {};
            sortFields.forEach(field => {
                if (field.startsWith('-')) {
                    sortStage[field.substring(1)] = -1;
                } else {
                    sortStage[field] = 1;
                }
            });
        }

        const blogs = await Blog.aggregate([
            { $match: matchConditions },
            // Populate userId
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { name: 1, email: 1 } }
                    ],
                    as: "userInfo"
                }
            },
            {
                $addFields: {
                    userId: { $arrayElemAt: ["$userInfo", 0] }
                }
            },
            // Like Count
            {
                $lookup: {
                    from: "likes",
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
                        { $count: "count" }
                    ],
                    as: "likeData"
                }
            },
            // Comment Count
            {
                $lookup: {
                    from: "comments",
                    let: { blogId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$blogId", "$$blogId"] },
                                        { $eq: ["$isDeleted", false] }
                                    ]
                                }
                            }
                        },
                        { $count: "count" }
                    ],
                    as: "commentData"
                }
            },
            {
                $addFields: {
                    likeCount: { $ifNull: [{ $arrayElemAt: ["$likeData.count", 0] }, 0] },
                    commentCount: { $ifNull: [{ $arrayElemAt: ["$commentData.count", 0] }, 0] }
                }
            },
            {
                $project: {
                    userInfo: 0,
                    likeData: 0,
                    commentData: 0,
                    __v: 0
                }
            },
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalBlogs = await Blog.countDocuments(matchConditions);

        const result = {
            blogs,
            totalBlogs,
            page,
            limit,
            totalPages: Math.ceil(totalBlogs / limit)
        };

        try {
            if (blogs.length > 0) {
                await redis.setex(cacheKey, 1800, JSON.stringify(result));
                await registerCacheKey(cacheKey);
            }
        } catch (err) {
            logger.error('❌ Redis Set Error:', err);
        }

        return result;
    }
};

export default blogService;
