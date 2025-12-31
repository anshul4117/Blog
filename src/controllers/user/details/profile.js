import User from '../../../models/user.js';

const userProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const getProfile = await User.findById(userId).select("-password");
        if (!getProfile) {
            return res.status(404)
                .json({
                    message: "Profile Unavailable"
                })
        }
        return res.status(200)
            .json({
                message: "fetched Profile",
                getProfile
            })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal Server Error"
            })
    }
}
export { userProfile }