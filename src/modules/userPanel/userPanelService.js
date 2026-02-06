const userPanelRepository = require("./userPanelRepository");
const { deleteFromCloudinary } = require("../../utils/cloudinaryUtil");

const getProfile = async (userId) => {
  const user = await userPanelRepository.getUserProfile(userId);
  if (!user) throw new Error("User not found");
  return user;
};

const updateProfileInfo = async (userId, data) => {
  const { email, password, role, ...allowedUpdates } = data;
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
};
