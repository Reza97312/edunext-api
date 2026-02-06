const userPanelService = require("./userPanelService");

const getProfile = async (req, res, next) => {
  try {
    const user = await userPanelService.getProfile(req.user._id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userPanelService.updateProfileInfo(
      req.user._id,
      req.body,
    );
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    // req.file حاوی اطلاعات فایل آپلود شده در کلادینری است
    const updatedUser = await userPanelService.updateProfileImage(
      req.user._id,
      req.file,
    );

    res.status(200).json({
      status: "success",
      message: "Profile image updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAvatar = async (req, res, next) => {
  try {
    const updatedUser = await userPanelService.deleteProfileImage(req.user._id);

    res.status(200).json({
      status: "success",
      message: "Profile image deleted successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
};
