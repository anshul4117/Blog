import User from '../../models/user.js';
import bcrypt from 'bcrypt';
const createUser = async (req, res) => {
  try {
    const { name, email, password, username, socialLinks } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'All fields are required' });
    }
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists' });
    }

    // Auto-generate username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      // e.g. "john.doe" from "john.doe@gmail.com"
      const baseName = email.split('@')[0];
      // Append random 4 digits to ensure uniqueness
      finalUsername = `${baseName}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Ensure username is unique
    const existingUsername = await User.findOne({ username: finalUsername });
    if (existingUsername) {
      // Just append another random number if collision
      finalUsername = `${finalUsername}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User(
      {
        name,
        email,
        password: hashedPassword,
        username: finalUsername,
        role: 'user', // Force default
        socialLinks: socialLinks || {}
      }
    );
    await newUser.save();
    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });

  } catch (error) {
    res.
      status(500)
      .json(
        { message: 'Server error', error: error.message }
      );
  }
};

export default createUser;