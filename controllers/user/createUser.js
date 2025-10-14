import User from '../../models/User.js';
import bcrypt from 'bcrypt';
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: 'All fields are required' });
        }
        // check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        const newUser = new User(
            {
                name,
                email,
                password: hashedPassword
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
            )
    }
}

export default createUser;