import User from '../../../models/user.js';
import Follow from '../../../models/follow.js';

const userProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const getProfile = await User.findById(userId).select('-password');
    if (!getProfile) {
      return res.status(404)
        .json({
          message: 'Profile Unavailable'
        });
    }
    const [followersCount, followingCount] = await Promise.all([
      Follow.countDocuments({ followingId: userId }),
      Follow.countDocuments({ followerId: userId })
    ]);

    return res.status(200).json({
      message: 'fetched Profile',
      getProfile: {
        ...getProfile.toObject(),
        followersCount,
        followingCount
      }
    });
  } catch (error) {
    return res.status(500)
      .json({
        message: 'Internal Server Error'
      });
  }
};
export { userProfile };