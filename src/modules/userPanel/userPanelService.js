const userPanelRepository = require("./userPanelRepository");
const { deleteFromCloudinary } = require("../../utils/cloudinaryUtils");
const User = require("../user/userModel");

const getProfile = async (userId) => {
  const user = await userPanelRepository.getUserProfile(userId);
  if (!user) throw new Error("User not found");
  return user;
};

const getUserCoursesWithStatus = async (userId) => {
  return await userPanelRepository.getUserCoursesWithStatus(userId);
};

const getUserCertificates = async (userId) => {
  return await userPanelRepository.getUserCertificates(userId);
};

const updateProfileInfo = async (userId, data) => {
  const { password, role, ...allowedUpdates } = data;

  if (allowedUpdates.email) {
    const existingUser = await User.findOne({ email: allowedUpdates.email });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new Error("Email already in use");
    }
  }

  const updatedUser = await userPanelRepository.updateUserProfile(
    userId,
    allowedUpdates,
  );
  return updatedUser;
};

const updateProfileImage = async (userId, fileData) => {
  const user = await userPanelRepository.getUserProfile(userId);

  if (user.profileImagePublicId) {
    await deleteFromCloudinary(user.profileImagePublicId);
  }

  const updatedUser = await userPanelRepository.updateUserAvatar(
    userId,
    fileData.path,
    fileData.filename,
  );

  return updatedUser;
};

const deleteProfileImage = async (userId) => {
  const user = await userPanelRepository.getUserProfile(userId);

  if (user.profileImagePublicId) {
    await deleteFromCloudinary(user.profileImagePublicId);
  }

  const updatedUser = await userPanelRepository.removeUserAvatar(userId);
  return updatedUser;
};

module.exports = {
  getProfile,
  updateProfileInfo,
  updateProfileImage,
  deleteProfileImage,
  getUserCoursesWithStatus,
  getUserCertificates,
};
