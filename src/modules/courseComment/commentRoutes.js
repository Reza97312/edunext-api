const express = require("express");
const router = express.Router();
const commentController = require("./commentController");
const { protect } = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");

/**
 * @openapi
 * /comments/{courseId}:
 *   post:
 *     summary: Create a new comment for a course
 *     tags: ["Course - Comment"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This course is very helpful
 *     responses:
 *       201:
 *         description: Comment sent for review
 *       400:
 *         description: Validation error
 */
router.post("/:courseId", protect, commentController.createComment);

/**
 * @openapi
 * /comments/{courseId}:
 *   get:
 *     summary: Get all confirmed comments of a course
 *     tags: ["Course - Comment"]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of course comments
 */
router.get("/:courseId", commentController.getCourseComments);

/**
 * @openapi
 * /comments/{commentId}/confirm:
 *   patch:
 *     summary: Confirm or reject a comment
 *     tags: ["Course - Comment"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Comment status updated
 *       404:
 *         description: Comment not found
 */
router.patch(
  "/:commentId/confirm",
  protect,
  authorize("admin", "superadmin"),
  commentController.confirmComment,
);

module.exports = router;
