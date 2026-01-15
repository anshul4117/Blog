import userService from '../../services/userService.js';

const createUser = async (req, res) => {
  try {
    const { name, email, password, username, socialLinks } = req.body;

    // Traffic Cop: Basic Input Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Delegate to the Expert
    const newUser = await userService.createUser({
      name,
      email,
      password,
      username,
      socialLinks
    });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });

  } catch (error) {
    // Traffic Cop: Error Formatting
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export default createUser;