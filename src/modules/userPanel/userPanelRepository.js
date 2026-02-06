const User = require("../user/userModel");

const getUserProfile = async (userId) => {
  return await User.findById(userId).select(
    "-password -passwordResetToken -passwordResetExpires",
  );
};

const updateUserProfile = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

const updateUserAvatar = async (userId, imageUrl, publicId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      profileImage: imageUrl,
      profileImagePublicId: publicId,
    },
    { new: true },
  ).select("-password");
};

const removeUserAvatar = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $unset: { profileImage: 1, profileImagePublicId: 1 },
    },
    { new: true },
  ).select("-password");
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  removeUserAvatar,
};
