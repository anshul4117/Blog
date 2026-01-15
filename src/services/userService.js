import User from '../models/user.js';
import bcrypt from 'bcrypt';

const userService = {

    // Create a new user with auto-generated username and hashed password

    async createUser({ name, email, password, username, socialLinks }) {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400; // Custom property for controller to use
            throw error;
        }

        // 2. Auto-generate username logic
        let finalUsername = username;
        if (!finalUsername) {
            const baseName = email.split('@')[0];
            finalUsername = `${baseName}${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // 3. Ensure username uniqueness
        const existingUsername = await User.findOne({ username: finalUsername });
        if (existingUsername) {
            finalUsername = `${finalUsername}${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username: finalUsername,
            role: 'user',
            dateOfJoin: Date.now(),
            socialLinks: socialLinks || {}
        });

        return await newUser.save();
    }
};

export default userService;
