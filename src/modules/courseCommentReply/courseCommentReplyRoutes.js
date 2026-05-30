const express = require("express");
const router = express.Router();
const replyController = require("./courseCommentReplyController");
const { protect } = require("../../middlewares/authMiddleware");
const { validateCreateReply } = require("./courseCommentReplyValidation");

/**
 * @openapi
 * /comment-replies/{commentId}:
 *   post:
 *     summary: Create a reply for a comment
 *     tags: ["Course - Comment Reply"]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 example: Thanks for your feedback!
 *     responses:
 *       201:
 *         description: Reply created successfully
 *       400:
 *         description: Validation error or invalid comment id
 *       404:
 *         description: Comment not found
 */
router.post(
  "/:commentId",
  protect,
  validateCreateReply,
  replyController.createReply,
);

/**
 * @openapi
 * /comment-replies/{commentId}:
 *   get:
 *     summary: Get all replies of a comment
 *     tags: ["Course - Comment Reply"]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of replies
 *       400:
 *         description: Invalid comment id
 *       404:
 *         description: Comment not found
 */
router.get("/:commentId", replyController.getRepliesByCommentId);

module.exports = router;
