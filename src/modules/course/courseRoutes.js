const express = require("express");
const router = express.Router();
const { upload } = require("../../config/uploadConfig");
const {
  protect,
  optionalProtect,
} = require("../../middlewares/authMiddleware");

const courseController = require("./courseController");
const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("./courseValidation");
const authorize = require("../../middlewares/roleMiddleware");

/**
 * @openapi
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - teacherName
 *               - price
 *               - categories
 *               - courseLevel
 *               - courseImage
 *               - courseVideo
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required - array of category IDs
 *               courseLevel:
 *                 type: string
 *                 description: Required - course level ID
 *               teacherName:
 *                 type: string
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               price:
 *                 type: number
 *                 example: 100
 *               courseImage:
 *                 type: string
 *                 format: binary
 *                 description: Required - course image file
 *               courseVideo:
 *                 type: string
 *                 format: binary
 *                 description: Required - course video file
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  protect,
  authorize("teacher", "admin", "superadmin"),
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  validateCreateCourse,
  courseController.createCourse,
);

/**
 * @openapi
 * /courses:
 *   get:
 *     summary: Get all courses with filters, search, sorting and pagination
 *     tags: [Course]
 *     parameters:
 *
 *       - in: query
 *         name: categories
 *         required: false
 *         schema:
 *           type: string
 *           example: "64a1,64a2"
 *         description: Comma separated category IDs
 *
 *       - in: query
 *         name: courseLevel
 *         required: false
 *         schema:
 *           type: string
 *           example: "64b1c2d3"
 *         description: Course level ID
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: "node"
 *         description: Search by course title (regex search)
 *
 *       - in: query
 *         name: price
 *         required: false
 *         schema:
 *           type: string
 *           enum: [free, paid]
 *         description: Filter courses by price type
 *
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [latest, oldest, price_asc, price_desc]
 *           example: latest
 *         description: Sort courses
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *         description: Page number for pagination
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *         description: Number of courses per page
 *
 *     responses:
 *       200:
 *         description: List of courses with filters applied
 */
router.get("/", optionalProtect, courseController.getCourses);

/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get("/:id", optionalProtect, courseController.getCourseById);

/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Course]
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
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete("/:id", protect, courseController.deleteCourse);

/**
 * @openapi
 * /courses/{id}/related:
 *   get:
 *     summary: Get related courses by category
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Current course ID
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 6
 *           example: 10
 *         description: Number of related courses to return (max 20)
 *
 *     responses:
 *       200:
 *         description: Related courses list
 *       404:
 *         description: Course not found
 */
router.get("/:id/related", optionalProtect, courseController.getRelatedCourses);

/**
 * @openapi
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               courseLevel:
 *                 type: string
 *               teacherName:
 *                 type: string
 *               rating:
 *                 type: number
 *               price:
 *                 type: number
 *               courseImage:
 *                 type: string
 *                 format: binary
 *               courseVideo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.put(
  "/:id",
  protect,
  authorize("teacher", "admin", "superadmin"),
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  validateUpdateCourse,
  courseController.updateCourse,
);

module.exports = router;
