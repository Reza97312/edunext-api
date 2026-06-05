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
 * /comments/admin:
 *   get:
 *     summary: Get all comments for admin panel
 *     tags: ["Course - Comment"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [confirmed, pending]
 *         description: Filter comments by confirmation status
 *
 *       - in: query
 *         name: courseId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter comments by course id
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search comments by user name
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of items per page
 *
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6851c0a1b5c8f7a123456789
 *
 *                       content:
 *                         type: string
 *                         example: This course was amazing
 *
 *                       isConfirmed:
 *                         type: boolean
 *                         example: false
 *
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: Reza Kazemi
 *                           profileImage:
 *                             type: string
 *                             nullable: true
 *
 *                       course:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                             example: Next.js Mastery
 *
 *                 total:
 *                   type: integer
 *                   example: 57
 *
 *                 page:
 *                   type: integer
 *                   example: 1
 *
 *                 limit:
 *                   type: integer
 *                   example: 10
 *
 *                 totalPages:
 *                   type: integer
 *                   example: 6
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 */
router.get(
  "/admin",
  protect,
  authorize("admin", "superadmin"),
  commentController.getAdminComments,
);

/**
 * @openapi
 * /comments/admin/{commentId}:
 *   delete:
 *     summary: Delete a comment in admin panel
 *     tags: ["Course - Comment"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete(
  "/admin/:commentId",
  protect,
  authorize("admin", "superadmin"),
  commentController.deleteComment,
);

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
