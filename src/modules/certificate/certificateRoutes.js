const express = require("express");
const router = express.Router();
const controller = require("./certificateController");
const { protect } = require("../../middlewares/authMiddleware");

/**
 * @openapi
 * /certificates/my:
 *   get:
 *     summary: Get logged in user certificates
 *     tags: [Certificate]
 *     security:
 *       - bearerAuth: []
 */
router.get("/my", protect, controller.getMyCertificates);

/**
 * @openapi
 * /certificates/{code}:
 *   get:
 *     summary: Get certificate by code (verify certificate)
 *     tags: [Certificate]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         example: "CERT-123456"
 */
router.get("/:code", controller.getCertificateByCode);

module.exports = router;
