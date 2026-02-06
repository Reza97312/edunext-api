const express = require("express");
const router = express.Router();
const userPanelController = require("./userPanelController");
const protect = require("../../middlewares/authMiddleware");
const { upload } = require("../../config/uploadConfig");
const { updateProfileValidator } = require("./userPanelValidation");

router.use(protect);

router.get("/profile", userPanelController.getProfile);

router.put(
  "/profile",
  updateProfileValidator,
  userPanelController.updateProfile,
);

router.post(
  "/profile-image",
  upload.single("profileImage"),
  userPanelController.uploadAvatar,
);

router.delete("/profile-image", userPanelController.deleteAvatar);

module.exports = router;
