// const express = require("express");
// const router = express.Router();
// const { upload } = require("../../config/uploadConfig");
// const {
//   protect,
//   optionalProtect,
// } = require("../../middlewares/authMiddleware");

// const courseController = require("./courseController");
// const {
//   validateCreateCourse,
//   validateUpdateCourse,
// } = require("./courseValidation");

// router.post(
//   "/",
//   protect,
//   upload.fields([
//     { name: "courseImage", maxCount: 1 },
//     { name: "teacherImage", maxCount: 1 },
//     { name: "courseVideo", maxCount: 1 },
//   ]),
//   validateCreateCourse,
//   courseController.createCourse,
// );

// router.get("/", optionalProtect, courseController.getCourses);

// router.get("/:id", optionalProtect, courseController.getCourseById);

// router.delete("/:id", protect, courseController.deleteCourse);

// router.put(
//   "/:id",
//   protect,
//   upload.fields([
//     { name: "courseImage", maxCount: 1 },
//     { name: "teacherImage", maxCount: 1 },
//     { name: "courseVideo", maxCount: 1 },
//   ]),
//   validateUpdateCourse,
//   courseController.updateCourse,
// );

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const { upload } = require("../../config/uploadConfig");
// const {
//   protect,
//   optionalProtect,
// } = require("../../middlewares/authMiddleware");

// const courseController = require("./courseController");
// const {
//   validateCreateCourse,
//   validateUpdateCourse,
// } = require("./courseValidation");

// /**
//  * @openapi
//  * /courses:
//  *   post:
//  *     summary: Create a new course
//  *     tags: [Course]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - title
//  *               - description
//  *               - categories
//  *               - courseLevel
//  *               - teacherName
//  *               - price
//  *               - courseImage
//  *               - teacherImage
//  *               - courseVideo
//  *             properties:
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               categories:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *               courseLevel:
//  *                 type: string
//  *               teacherName:
//  *                 type: string
//  *               rating:
//  *                 type: number
//  *                 example: 4.5
//  *               price:
//  *                 type: number
//  *                 example: 100
//  *               courseImage:
//  *                 type: string
//  *                 format: binary
//  *               teacherImage:
//  *                 type: string
//  *                 format: binary
//  *               courseVideo:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       201:
//  *         description: Course created successfully
//  *       400:
//  *         description: Validation error
//  */
// router.post(
//   "/",
//   protect,
//   upload.fields([
//     { name: "courseImage", maxCount: 1 },
//     { name: "teacherImage", maxCount: 1 },
//     { name: "courseVideo", maxCount: 1 },
//   ]),
//   validateCreateCourse,
//   courseController.createCourse,
// );

// /**
//  * @openapi
//  * /courses:
//  *   get:
//  *     summary: Get all courses
//  *     tags: [Course]
//  *     parameters:
//  *       - in: query
//  *         name: categories
//  *         schema:
//  *           type: string
//  *         description: Comma separated category IDs
//  *       - in: query
//  *         name: courseLevel
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: price
//  *         schema:
//  *           type: string
//  *           enum: [free, paid]
//  *       - in: query
//  *         name: sort
//  *         schema:
//  *           type: string
//  *           enum: [latest, oldest, price_asc, price_desc]
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: number
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: number
//  *     responses:
//  *       200:
//  *         description: List of courses
//  */
// router.get("/", optionalProtect, courseController.getCourses);

// /**
//  * @openapi
//  * /courses/{id}:
//  *   get:
//  *     summary: Get course by ID
//  *     tags: [Course]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Course details
//  *       404:
//  *         description: Course not found
//  */
// router.get("/:id", optionalProtect, courseController.getCourseById);

// /**
//  * @openapi
//  * /courses/{id}:
//  *   delete:
//  *     summary: Delete a course
//  *     tags: [Course]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Course deleted successfully
//  *       404:
//  *         description: Course not found
//  */
// router.delete("/:id", protect, courseController.deleteCourse);

// /**
//  * @openapi
//  * /courses/{id}:
//  *   put:
//  *     summary: Update a course
//  *     tags: [Course]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               categories:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *               courseLevel:
//  *                 type: string
//  *               teacherName:
//  *                 type: string
//  *               rating:
//  *                 type: number
//  *               price:
//  *                 type: number
//  *               courseImage:
//  *                 type: string
//  *                 format: binary
//  *               teacherImage:
//  *                 type: string
//  *                 format: binary
//  *               courseVideo:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Course updated successfully
//  *       404:
//  *         description: Course not found
//  */
// router.put(
//   "/:id",
//   protect,
//   upload.fields([
//     { name: "courseImage", maxCount: 1 },
//     { name: "teacherImage", maxCount: 1 },
//     { name: "courseVideo", maxCount: 1 },
//   ]),
//   validateUpdateCourse,
//   courseController.updateCourse,
// );

// module.exports = router;
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional - array of category IDs
 *               courseLevel:
 *                 type: string
 *                 description: Optional - course level ID
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
 *                 description: Optional - course image file
 *               teacherImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional - teacher image file
 *               courseVideo:
 *                 type: string
 *                 format: binary
 *                 description: Optional - course video file
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  protect,
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "teacherImage", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  validateCreateCourse,
  courseController.createCourse,
);

/**
 * @openapi
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     parameters:
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Comma separated category IDs
 *       - in: query
 *         name: courseLevel
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: price
 *         schema:
 *           type: string
 *           enum: [free, paid]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest, price_asc, price_desc]
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
 *         description: List of courses
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
 *               teacherImage:
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
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "teacherImage", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  validateUpdateCourse,
  courseController.updateCourse,
);

module.exports = router;
