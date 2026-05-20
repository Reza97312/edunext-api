const router = require("express").Router();
const { protect } = require("../../middlewares/authMiddleware");
const { updateProgress, getProgress } = require("./userProgressController");

/**
 * @openapi
 * /user-progress:
 *   post:
 *     summary: Update user video progress
 *     tags: ["User Progress"]
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
 *               - watchedSeconds
 *               - totalSeconds
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 664f1a2b3c4d5e6f7a8b9c0d
 *               watchedSeconds:
 *                 type: number
 *                 example: 120
 *               totalSeconds:
 *                 type: number
 *                 example: 600
 *     responses:
 *       200:
 *         description: Progress updated
 *       400:
 *         description: Invalid input
 */
router.post("/", protect, updateProgress);

/**
 * @openapi
 * /user-progress/{courseId}:
 *   get:
 *     summary: Get user video progress (for resume)
 *     tags: ["User Progress"]
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
 *         description: User progress data
 */
router.get("/:courseId", protect, getProgress);

module.exports = router;
