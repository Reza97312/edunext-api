const express = require("express");
const router = express.Router();
const controller = require("./questionController");
const { validateCreateQuestionsBulk } = require("./questionValidation");

/**
 * @openapi
 * /questions/bulk:
 *   post:
 *     summary: Create multiple questions for one exam
 *     tags: [Question]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examId
 *               - questions
 *             properties:
 *               examId:
 *                 type: string
 *                 example: "69fb8f728188536e399c8b83"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - text
 *                     - options
 *                     - correctAnswer
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "What is Node.js?"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "Runtime"
 *                         - "Database"
 *                         - "Framework"
 *                         - "Language"
 *                     correctAnswer:
 *                       type: string
 *                       example: "Runtime"
 *                     score:
 *                       type: number
 *                       example: 1
 *     responses:
 *       201:
 *         description: Questions created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 20
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.post(
  "/bulk",
  validateCreateQuestionsBulk,
  controller.createQuestionsBulk,
);

/**
 * @openapi
 * /questions/exam/{examId}:
 *   get:
 *     summary: Get questions by exam
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *         example: "69fb8f728188536e399c8b83"
 *     responses:
 *       200:
 *         description: Questions fetched successfully
 */
router.get("/exam/:examId", controller.getByExam);

/**
 * @openapi
 * /questions/{id}:
 *   put:
 *     summary: Update question
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1c2a8f1b2c0012349999"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctAnswer:
 *                 type: string
 *               score:
 *                 type: number
 */
router.put("/:id", controller.updateQuestion);

/**
 * @openapi
 * /questions/{id}:
 *   delete:
 *     summary: Delete question
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1c2a8f1b2c0012349999"
 */
router.delete("/:id", controller.deleteQuestion);

module.exports = router;
