const express = require("express");
const router = express.Router();
const controller = require("./examController");
const { validateCreateExam, validateUpdateExam } = require("./examValidation");

/**
 * @openapi
 * /exams:
 *   post:
 *     summary: Create exam for course
 *     tags: [Exam]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *               - title
 *             properties:
 *               course:
 *                 type: string
 *                 example: "665f1c2a8f1b2c0012345678"
 *               title:
 *                 type: string
 *                 example: "Final Exam"
 *               passingScore:
 *                 type: number
 *                 example: 70
 *               timeLimit:
 *                 type: number
 *                 example: 60
 *     responses:
 *       201:
 *         description: Exam created successfully
 */
router.post("/", validateCreateExam, controller.createExam);

/**
 * @openapi
 * /exams/course/{courseId}:
 *   get:
 *     summary: Get exam by course
 *     tags: [Exam]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1c2a8f1b2c0012345678"
 *     responses:
 *       200:
 *         description: Exam fetched successfully
 */
router.get("/course/:courseId", controller.getExamByCourse);

/**
 * @openapi
 * /exams/{id}:
 *   put:
 *     summary: Update exam
 *     tags: [Exam]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1c2a8f1b2c0012345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Midterm Exam"
 *               passingScore:
 *                 type: number
 *                 example: 75
 *               timeLimit:
 *                 type: number
 *                 example: 45
 *     responses:
 *       200:
 *         description: Exam updated successfully
 */
router.put("/:id", validateUpdateExam, controller.updateExam);

/**
 * @openapi
 * /exams/{id}:
 *   delete:
 *     summary: Delete exam
 *     tags: [Exam]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1c2a8f1b2c0012345678"
 *     responses:
 *       200:
 *         description: Exam deleted successfully
 *       400:
 *         description: Cannot delete exam with attempts
 */
router.delete("/:id", controller.deleteExam);

module.exports = router;
