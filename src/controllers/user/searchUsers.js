import User from '../../models/user.js';

/**
 * GET /search?q=john&page=1&limit=10
 * Search users by name or username
 */
const searchUsers = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                message: 'Search query must be at least 2 characters'
            });
        }

        const skip = (page - 1) * limit;

        // Case-insensitive regex search on name and username
        const searchRegex = new RegExp(q.trim(), 'i');

        const users = await User.find({
            $or: [
                { name: searchRegex },
                { username: searchRegex }
            ]
        })
            .select('name username email bio profilePicture profession')
            .skip(skip)
            .limit(limit * 1)
            .lean();

        const total = await User.countDocuments({
            $or: [
                { name: searchRegex },
                { username: searchRegex }
            ]
        });

        return res.status(200).json({
            status: 'success',
            results: users,
            total,
            page: page * 1,
            pages: Math.ceil(total / limit)
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error searching users',
            error: error.message
        });
    }
};

export default searchUsers;
