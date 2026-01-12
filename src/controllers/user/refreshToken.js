import jwt from 'jsonwebtoken';
import RefreshToken from '../../models/RefreshToken.js';
import dotenv from 'dotenv';
import config from '../../config/index.js';
dotenv.config();

const refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (!requestToken) {
        return res.status(403).json({ status: 'fail', message: 'Refresh Token is required!' });
    }

    try {
        // 1. Find token in DB
        const tokenInDb = await RefreshToken.findOne({ token: requestToken });
        if (!tokenInDb) {
            return res.status(403).json({ status: 'fail', message: 'Refresh token is not in database!' });
        }

        // 2. Check Expiry
        if (RefreshToken.verifyExpiration(tokenInDb)) {
            await RefreshToken.findByIdAndRemove(tokenInDb._id, { useFindAndModify: false });
            return res.status(403).json({
                status: 'fail',
                message: 'Refresh token was expired. Please make a new signin request',
            });
        }

        // 3. Issue new Access Token
        const newAccessToken = jwt.sign(
            { userId: tokenInDb.userId }, // In a real app, you might want to fetch the User to get email/roles again.
            process.env.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRY || '15m' }
        );

        return res.status(200).json({
            status: 'success',
            accessToken: newAccessToken,
            refreshToken: tokenInDb.token,
        });
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message });
    }
};

export default refreshToken;
