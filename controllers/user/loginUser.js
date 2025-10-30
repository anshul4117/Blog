import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const loginUser = async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;

    try {
       
        // Check if user exists
        const user = await User.findOne({ email })
        // .select('-password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // console.log(isMatch);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const options = {
            httpOnly: true,
            secure: false,
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        }
        
        res.status(200)
        .cookie('token', token, options)
        .json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export default loginUser;