import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import dotenv from "dotenv";
dotenv.config();

// Generate Access Token
export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY || "15m", // short-lived
        }
    );
};

// Generate Refresh Token & store in DB
export const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_JWT_EXPIRY || "7d", // long-lived
        }
    );

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await RefreshToken.create({
        token: refreshToken,
        userId: user._id,
        expiryDate,
    });

    return refreshToken;
};
