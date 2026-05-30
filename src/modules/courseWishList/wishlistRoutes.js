const express = require("express");
const router = express.Router();
const wishlistController = require("./wishlistController");
const { protect } = require("../../middlewares/authMiddleware");

/**
 * @openapi
 * /wishlist:
 *   post:
 *     summary: Add course to wishlist
 *     tags: ["Course - Wishlist"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 665f1c2b9c1234567890abcd
 *     responses:
 *       201:
 *         description: Course added to wishlist
 *       400:
 *         description: Validation error
 */
router.post("/", protect, wishlistController.add);

/**
 * @openapi
 * /wishlist/{courseId}:
 *   delete:
 *     summary: Remove course from wishlist
 *     tags: ["Course - Wishlist"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed successfully
 *       404:
 *         description: Course not found in wishlist
 */
router.delete("/:courseId", protect, wishlistController.remove);

/**
 * @openapi
 * /wishlist/my-courses:
 *   get:
 *     summary: Get my wishlist courses
 *     tags: ["Course - Wishlist"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of wishlist courses
 */
router.get("/my-courses", protect, wishlistController.myWishlist);

module.exports = router;
