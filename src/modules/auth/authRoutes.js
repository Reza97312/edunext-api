const express = require("express");
const authController = require("./authController");
const authorize = require("../../middlewares/roleMiddleware");
const { authLimiter } = require("../../middlewares/rateLimitMiddleware");
const { protect } = require("../../middlewares/authMiddleware");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("./authValidation");

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post(
  "/register",
  authLimiter,
  validateRegister,
  authController.register
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authLimiter, validateLogin, authController.login);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Send reset password email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Reset token generated
 *       400:
 *         description: Validation error
 */
router.post(
  "/forgot-password",
  authLimiter,
  validateForgotPassword,
  authController.forgotPassword
);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword
);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get("/profile", protect, authController.profile);

/**
 * @openapi
 * /auth/admin-only:
 *   get:
 *     summary: Admin only endpoint
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 *       403:
 *         description: Forbidden
 */
router.get(
  "/admin-only",
  protect,
  authorize("admin"),
  authController.adminOnly
);

module.exports = router;
