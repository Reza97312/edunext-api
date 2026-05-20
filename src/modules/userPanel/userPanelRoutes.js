// const express = require("express");
// const router = express.Router();
// const userPanelController = require("./userPanelController");
// const { protect } = require("../../middlewares/authMiddleware");
// const { upload } = require("../../config/uploadConfig");
// const { updateProfileValidator } = require("./userPanelValidation");

// router.use(protect);

// router.get("/profile", userPanelController.getProfile);

// router.put(
//   "/profile",
//   updateProfileValidator,
//   userPanelController.updateProfile,
// );

// router.post(
//   "/profile-image",
//   upload.single("profileImage"),
//   userPanelController.uploadAvatar,
// );

// router.delete("/profile-image", userPanelController.deleteAvatar);

// module.exports = router;
const express = require("express");
const router = express.Router();
const userPanelController = require("./userPanelController");
const { protect } = require("../../middlewares/authMiddleware");
const { upload } = require("../../config/uploadConfig");
const { updateProfileValidator } = require("./userPanelValidation");

router.use(protect);

/**
 * @openapi
 * /user-panel/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: ["User Panel"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       404:
 *         description: User not found
 */
router.get("/profile", userPanelController.getProfile);

/**
 * @openapi
 * /user-panel/my-courses:
 *   get:
 *     summary: Get user purchased courses with exam status
 *     tags: ["User Panel"]
 *     security:
 *       - bearerAuth: []
 */
router.get("/my-courses", userPanelController.getMyCourses);

/**
 * @openapi
 * /user-panel/certificates:
 *   get:
 *     summary: Get user certificates
 *     tags: ["User Panel"]
 *     security:
 *       - bearerAuth: []
 */
router.get("/certificates", userPanelController.getCertificates);

/**
 * @openapi
 * /user-panel/profile:
 *   put:
 *     summary: Update user profile
 *     tags: ["User Panel"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^[0-9]{10,15}$"
 *                 example: "09123456789"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               birthday:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               about:
 *                 type: string
 *                 maxLength: 500
 *                 example: About me...
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error or email already in use
 */
router.put(
  "/profile",
  updateProfileValidator,
  userPanelController.updateProfile,
);

/**
 * @openapi
 * /user-panel/profile-image:
 *   post:
 *     summary: Upload profile image
 *     tags: ["User Panel"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *       400:
 *         description: No file uploaded
 */
router.post(
  "/profile-image",
  upload.single("profileImage"),
  userPanelController.uploadAvatar,
);

/**
 * @openapi
 * /user-panel/profile-image:
 *   delete:
 *     summary: Delete profile image
 *     tags: ["User Panel"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image deleted successfully
 */
router.delete("/profile-image", userPanelController.deleteAvatar);

module.exports = router;
