const express = require("express");
const router = express.Router();

const landingController = require("./landingController");

/**
 * @openapi
 * /landing/reports:
 *   get:
 *     summary: Get landing page statistics
 *     tags: [Landing]
 *     responses:
 *       200:
 *         description: Landing reports fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCourses:
 *                       type: number
 *                     totalTeachers:
 *                       type: number
 *                     totalStudents:
 *                       type: number
 */
router.get("/reports", landingController.getLandingReports);

module.exports = router;
