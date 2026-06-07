import RefreshToken from '../../models/RefreshToken.js';
import User from '../../models/user.js';
import dotenv from 'dotenv';
import config from '../../config/index.js';
import { generateAccessToken } from '../../utils/token.js';
dotenv.config();

const refreshToken = async (req, res) => {
  const requestToken = req.cookies?.refreshToken || req.body?.refreshToken;

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
      await RefreshToken.findByIdAndDelete(tokenInDb._id);
      return res.status(403).json({
        status: 'fail',
        message: 'Refresh token was expired. Please make a new signin request',
      });
    }

    // Fetch user to generate a valid access token with correct details
    const user = await User.findById(tokenInDb.userId);
    if (!user) {
      return res.status(403).json({ status: 'fail', message: 'User not found!' });
    }

    // 3. Issue new Access Token
    const newAccessToken = generateAccessToken(user);

    const options = {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    };

    res.cookie('accessToken', newAccessToken, options);

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
