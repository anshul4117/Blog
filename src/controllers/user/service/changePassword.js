import User from '../../../models/user.js';
import bcrypt from 'bcrypt';

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;       
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400)
        .json({
          message: 'All fields are required'
        });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400)
        .json({
          message: 'New password do not match'
        });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404)
        .json({
          message: 'User not found'
        });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401)
        .json({
          message: 'Old password is incorrect'
        });
    }
    if(oldPassword == newPassword){
      return res.status(400)
        .json({
          message: 'Password same as older'
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.dob = Date.now();
    await user.save();

    return res.status(200)
      .json({
        message: 'Password changed successfully ✅'
      });

  } catch (error) {
    return res.status(500)
      .json({
        message: 'Password Not Changed',
        error: error.message
      });
  }
};

export { changePassword };