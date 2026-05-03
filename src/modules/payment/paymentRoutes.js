// const express = require("express");
// const router = express.Router();
// const paymentController = require("./paymentController");
// const { protect } = require("../../middlewares/authMiddleware");

// router.post("/request", protect, paymentController.requestPayment);

// router.get("/verify", paymentController.verifyPayment);

// router.get("/my-payments", protect, paymentController.getMyPayments);

// module.exports = router;
const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");
const { protect } = require("../../middlewares/authMiddleware");

/**
 * @openapi
 * /payments/request:
 *   post:
 *     summary: Request a payment for a course
 *     tags: ["Course - Payment"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 665f1c2b9c1234567890abcd
 *     responses:
 *       200:
 *         description: Payment request created successfully
 *       400:
 *         description: Course not found, already purchased, or free course
 */
router.post("/request", protect, paymentController.requestPayment);

/**
 * @openapi
 * /payments/verify:
 *   get:
 *     summary: Verify payment (callback from payment gateway)
 *     tags: ["Course - Payment"]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: PayerID
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to success or cancel page
 */
router.get("/verify", paymentController.verifyPayment);

/**
 * @openapi
 * /payments/my-payments:
 *   get:
 *     summary: Get current user's payment history
 *     tags: ["Course - Payment"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user payments
 */
router.get("/my-payments", protect, paymentController.getMyPayments);

module.exports = router;
