const express = require("express");
const adminPanelController = require("./adminPanelController");
const { protect } = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");
const { validateUpdateSettings } = require("./adminPanelValidation");

const router = express.Router();

/**
 * @openapi
 * /admin-panel/reports:
 *   get:
 *     summary: Get admin dashboard reports
 *     description: Returns dashboard statistics including students, courses, sales, monthly growth and revenue metrics.
 *     tags: [Admin Panel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard reports fetched successfully
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
 *                   properties:
 *                     totalStudents:
 *                       type: object
 *                     totalCourses:
 *                       type: object
 *                     totalSales:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.get(
  "/reports",
  protect,
  authorize("admin", "superadmin"),
  adminPanelController.getReports,
);

/**
 * @openapi
 * /admin-panel/settings:
 *   get:
 *     summary: Get site settings
 *     description: Retrieve global site settings like title and maintenance mode. Publicly accessible.
 *     tags: [Admin Panel]
 *     responses:
 *       200:
 *         description: Settings fetched successfully
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
 *                   properties:
 *                     siteTitle:
 *                       type: string
 *                       example: "Edunext API"
 *                     isMaintenanceMode:
 *                       type: boolean
 *                       example: false
 *   put:
 *     summary: Update site settings
 *     description: Updates global site settings. Accessible by admin and superadmin only.
 *     tags: [Admin Panel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteTitle:
 *                 type: string
 *                 example: "Edunext API Updated"
 *               isMaintenanceMode:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/settings", adminPanelController.getSettings);

router.put(
  "/settings",
  protect,
  authorize("admin", "superadmin"),
  validateUpdateSettings,
  adminPanelController.updateSettings,
);

module.exports = router;
