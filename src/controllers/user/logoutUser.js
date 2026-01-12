import RefreshToken from '../../models/RefreshToken.js';

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // If refreshToken provided, delete it
        if (refreshToken) {
            await RefreshToken.findOneAndDelete({ token: refreshToken });
        }

        // Clear cookie if we were using it (optional, good practice)
        res.clearCookie('token');

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully!',
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

export default logoutUser;
