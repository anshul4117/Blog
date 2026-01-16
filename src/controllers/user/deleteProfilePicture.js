import User from '../../models/user.js';
import { deleteFromCloudinary } from '../../utils/cloudinaryHelper.js';

const deleteProfilePicture = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Find User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Check if profile picture exists
        if (!user.profilePicture) {
            return res.status(400).json({ message: 'No profile picture to remove' });
        }

        // 3. Delete from Cloudinary
        await deleteFromCloudinary(user.profilePicture);

        // 4. Update User Record
        user.profilePicture = '';
        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Profile picture removed successfully',
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error removing profile picture',
            error: error.message
        });
    }
};

export default deleteProfilePicture;
