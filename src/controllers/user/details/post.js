import User from '../../../models/user.js'

const userPost = async (req, res) => {
    try {
        const { userId } = req.user;
        const totalPost = await User.countDocuments({
            userId: userId
        });
        return res.status(200)
            .json({
                message: "get total posts len",
                totalPost
            });
    } catch (error) {
        return res.status(500)
            .json({
                message: "Error Fetching Posts",
                error: error.message
            })
    }
}

export {userPost};