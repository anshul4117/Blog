import RefreshToken from '../../models/RefreshToken.js';

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body || req.cookies;

        // If refreshToken provided, delete it
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token not found' });
        }
        const result = await RefreshToken.findOneAndDelete({ token: refreshToken });
        console.log("result: ", result);

        // Clear cookie if we were using it (optional, good practice)
        res.clearCookie('refreshToken', { path: '/' });

        res.status(200).json({
            message: 'Logged out successfully!',
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default logoutUser;
