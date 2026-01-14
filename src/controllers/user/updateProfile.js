import config from '../../config/index.js';
import User from '../../models/user.js';

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params || req.user.id; // assuming user ID is passed as a URL parameter or from authenticated user
    let { name, bio, profession, gender, dob, interests, profilePicture, socialLinks } = req.body;

    // Handle File Upload
    if (req.file) {
      // Construct URL: http://localhost:5000/uploads/profiles/filename.jpg
      const profileUrl = `${config.APP_URL}/uploads/profiles/${req.file.filename}`;
      profilePicture = profileUrl;
    }

    // Check if user ID is provided
    if (!id) {
      return res.status(400)
        .json({
          message: 'User Not Found',
        });
    }

    // Validation for name length
    if (name && name.length > 50) {
      return res.status(400)
        .json({
          message: 'Name cannot exceed 50 characters',
        });
    }

    // Validation for bio length
    if (bio && bio.length > 100) {
      return res.status(400)
        .json({
          message: 'Bio cannot exceed 100 characters',
        });
    }

    // minimum age is 18
    const currentDate = new Date();
    const birthDate = new Date(dob);
    const ageDiff = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    const dayDiff = currentDate.getDate() - birthDate.getDate();
    let calculatedAge = ageDiff;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      calculatedAge--;
    }
    if (calculatedAge < 18) {
      return res.status(400)
        .json({
          message: 'User must be at least 18 years old',
        });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, bio, profession, gender, dob, interests, profilePicture, socialLinks },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404)
        .json({
          message: 'Server Error',
        });
    }

    return res.status(200)
      .json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
  } catch (error) {
    return res.status(500)
      .json({
        message: 'Error updating profile',
        error: error.message
      });
  }
};
export default updateProfile;