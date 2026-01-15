import User from '../../models/user.js';
import RefreshToken from '../../models/RefreshToken.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 'fail', message: 'Invalid credentials' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'fail', message: 'Invalid credentials' });
    }

    // 3. Generate Access Token (Short-lived: 15m)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRY || '15m' }
    );

    // 4. Generate Refresh Token (Long-lived: 7d)
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7); // 7 days from now

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET || 'refreshSecretKey', // Fallback for dev
      { expiresIn: '7d' }
    );

    // 5. Store Refresh Token in DB
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiryDate: expiredAt,
    });

    // 6. Send Response
    // We send tokens in Body for flexibility (Client stores in memo ry/storage)
    // Optionally also set cookies if needed, but Body is standard for mobile/SPA.
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        profilePicture: user.profilePicture,
        socialLinks: user.socialLinks,
        dateOfJoin: user.dateOfJoin,
        interests: user.interests,
        dob: user.dob,
        gender: user.gender,
        bio: user.bio,
        profession: user.profession,
      },
    });

  } catch (error) {
    next(error);
  }
};

// Quick config helper since we didn't import the full config object above
const config = { JWT_EXPIRY: '15m' };

export default loginUser;