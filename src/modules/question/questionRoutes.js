const express = require("express");
const router = express.Router();
const controller = require("./questionController");

/**
 * @openapi
 * /questions:
 *   post:
 *     summary: Create a question for an exam
 *     tags: [Question]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam
 *               - text
 *               - correctAnswer
 *             properties:
 *               exam:
 *                 type: string
 *                 example: "69fb8f728188536e399c8b83"
 *               text:
 *                 type: string
 *                 example: "What is Node.js?"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "Runtime"
 *                   - "Database"
 *                   - "Framework"
 *                   - "Language"
 *               correctAnswer:
 *                 type: string
 *                 example: "Runtime"
 *               score:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 */
router.post("/", controller.createQuestion);

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
// const express = require("express");
// const router = express.Router();
// const controller = require("./questionController");

// /**
//  * @openapi
//  * /questions:
//  *   post:
//  *     summary: Create a question for an exam
//  *     tags: [Question]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - exam
//  *               - text
//  *               - correctAnswer
//  *             properties:
//  *               exam:
//  *                 type: string
//  *                 example: "69fb8f728188536e399c8b83"
//  *               text:
//  *                 type: string
//  *                 example: "What is Node.js?"
//  *               options:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 example:
//  *                   - "Runtime"
//  *                   - "Database"
//  *                   - "Framework"
//  *                   - "Language"
//  *               correctAnswer:
//  *                 type: string
//  *                 example: "Runtime"
//  *               score:
//  *                 type: number
//  *                 example: 1
//  *     responses:
//  *       201:
//  *         description: Question created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  */
// router.post("/", controller.createQuestion);

// /**
//  * @openapi
//  * /questions/exam/{examId}:
//  *   get:
//  *     summary: Get questions by exam
//  *     tags: [Question]
//  *     parameters:
//  *       - in: path
//  *         name: examId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         example: "69fb8f728188536e399c8b83"
//  *     responses:
//  *       200:
//  *         description: Questions fetched successfully
//  */
// router.get("/exam/:examId", controller.getByExam);

// module.exports = router;
