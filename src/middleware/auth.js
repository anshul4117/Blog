import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import blacklistService from '../services/blacklistService.js';
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken || req.body?.token;

    if (!token) {
      return res.status(401).json({ message: 'Authorization failed: No token provided' });
    }

    // Check Blacklist
    const isBlacklisted = await blacklistService.isBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authorization failed: Invalid token' });
  }
};
export default auth;