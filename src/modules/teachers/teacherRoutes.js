const express = require("express");
const teacherController = require("./teacherController");

const router = express.Router();

/**
 * @openapi
 * /teachers:
 *   get:
 *     summary: Get all teachers (with search & pagination)
 *     tags: [Teacher]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search teachers by name or email
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *
 *     responses:
 *       200:
 *         description: List of teachers
 */
router.get("/", teacherController.getAllTeachers);

/**
 * @openapi
 * /teachers/{id}:
 *   get:
 *     summary: Get teacher by id
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher details
 *       404:
 *         description: Teacher not found
 */
router.get("/:id", teacherController.getTeacherById);

module.exports = router;
