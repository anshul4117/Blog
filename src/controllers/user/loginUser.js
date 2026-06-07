import config from '../../config/index.js';
import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.js';
dotenv.config();

const options = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

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