// const express = require("express");
// const router = express.Router();
// const { validateCreateCourseLevel } = require("./courseLevelValidation");
// const controller = require("./courseLevelController");
// const { protect } = require("../../middlewares/authMiddleware");

// router.get("/", controller.getCourseLevels);

// router.post(
//   "/",
//   protect,
//   validateCreateCourseLevel,
//   controller.createCourseLevel,
// );

// router.delete("/:id", protect, controller.deleteCourseLevel);

// module.exports = router;
const express = require("express");
const router = express.Router();
const { validateCreateCourseLevel } = require("./courseLevelValidation");
const controller = require("./courseLevelController");
const { protect } = require("../../middlewares/authMiddleware");

/**
 * @openapi
 * /course-levels:
 *   get:
 *     summary: Get all course levels
 *     tags: ["Course - Level"]
 *     responses:
 *       200:
 *         description: List of course levels
 */
router.get("/", controller.getCourseLevels);

/**
 * @openapi
 * /course-levels:
 *   post:
 *     summary: Create a new course level
 *     tags: ["Course - Level"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: Beginner
 *               description:
 *                 type: string
 *                 example: مناسب برای افراد مبتدی
 *     responses:
 *       201:
 *         description: Course level created successfully
 *       400:
 *         description: Validation error or duplicate level
 */
router.post(
  "/",
  protect,
  validateCreateCourseLevel,
  controller.createCourseLevel,
);

/**
 * @openapi
 * /course-levels/{id}:
 *   delete:
 *     summary: Delete a course level
 *     tags: ["Course - Level"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course level deleted successfully
 *       400:
 *         description: Invalid id or level in use
 *       404:
 *         description: Course level not found
 */
router.delete("/:id", protect, controller.deleteCourseLevel);

module.exports = router;
