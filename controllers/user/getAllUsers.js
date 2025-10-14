import User from '../../models/User.js'
const allUsers = async(req,res)=>{
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export default allUsers;