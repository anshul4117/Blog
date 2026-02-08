import RefreshToken from '../../models/RefreshToken.js';
import blacklistService from '../../services/blacklistService.js';
import jwt from 'jsonwebtoken';

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies || req.body;
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // 1. Revoke Refresh Token (Hard Delete)
        if (refreshToken) {
            await RefreshToken.findOneAndDelete({ token: refreshToken });
        }

        // 2. Blacklist Access Token
        if (accessToken) {
            try {
                const decoded = jwt.decode(accessToken);
                if (decoded && decoded.exp) {
                    const expirySeconds = decoded.exp - Math.floor(Date.now() / 1000);
                    if (expirySeconds > 0) {
                        await blacklistService.addToBlacklist(accessToken, expirySeconds);
                    }
                }
            } catch (ignore) {
                // Should not fail logout if token is already malformed
            }
        }

        // 3. Clear Cookies
        const options = {
            httpOnly: true,
            secure: true,
            path: '/' // Ensure path matches login path
        };

        res.clearCookie('accessToken', options);
        res.clearCookie('refreshToken', options);

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully!',
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default logoutUser;

