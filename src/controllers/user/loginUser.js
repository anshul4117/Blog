import config from '../../config/index.js';
import User from '../../models/user.js';
import RefreshToken from '../../models/RefreshToken.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.js';
dotenv.config();

const options = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 'fail', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'fail', message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {
    next(error);
  }
};

export default loginUser;