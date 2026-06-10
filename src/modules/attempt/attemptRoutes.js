const express = require("express");
const router = express.Router();
const controller = require("./attemptController");
const { protect } = require("../../middlewares/authMiddleware");

/**
 *  @openapi
 *  /attempts/submit:
 *    post:
 *      summary: Submit exam answers
 *      tags: [Attempt]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - examId
 *                - answers
 *              properties:
 *                examId:
 *                  type: string
 *                  example: "665f1c2a8f1b2c0012345678"
 *                answers:
 *                  type: array
 *                  items:
 *                    type: object
 *                    required:
 *                      - questionId
 *                      - answer
 *                    properties:
 *                      questionId:
 *                        type: string
 *                        example: "665f1c2a8f1b2c0012349999"
 *                      answer:
 *                        type: string
 *                        example: "Runtime"
 *                isAutoSubmitted:
 *                  type: boolean
 *                  description: true when auto-submitted due to time expiration
 *                  example: false
 *      responses:
 *        200:
 *          description: Exam submitted successfully
 *        401:
 *          description: Unauthorized
 */

router.post("/submit", protect, controller.submitExam);

module.exports = router;
