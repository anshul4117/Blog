import User from '../../../models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import redis from '../../../config/redisClient.js';
import sendEmail from '../../../config/mailer.js';

/**
 * POST /forgot-password
 * Generates a 6-digit OTP, stores in Redis (10 min TTL), emails it
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if email exists (security best practice)
            return res.status(200).json({
                message: 'If this email is registered, you will receive a reset OTP'
            });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store OTP in Redis with 10 min TTL
        const otpKey = `reset_otp:${email}`;
        await redis.setex(otpKey, 600, otp);

        // Send OTP via email
        await sendEmail(
            email,
            'Password Reset OTP - Blog App',
            `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
                <h2 style="color: #333;">Password Reset</h2>
                <p>You requested a password reset. Use the OTP below:</p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
                </div>
                <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
                <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            </div>
            `
        );

        return res.status(200).json({
            message: 'If this email is registered, you will receive a reset OTP'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error sending reset email',
            error: error.message
        });
    }
};

/**
 * POST /reset-password
 * Verifies OTP and resets password
 */
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: 'Email, OTP, and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        // Verify OTP from Redis
        const otpKey = `reset_otp:${email}`;
        const storedOtp = await redis.get(otpKey);

        if (!storedOtp || storedOtp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        // Delete OTP from Redis (one-time use)
        await redis.del(otpKey);

        return res.status(200).json({
            message: 'Password reset successfully. Please login with your new password.'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error resetting password',
            error: error.message
        });
    }
};

export { forgotPassword, resetPassword };
