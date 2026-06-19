const express = require("express");
const authorize = require("../../middlewares/roleMiddleware");
const router = express.Router();
const paymentController = require("./paymentController");
const { protect } = require("../../middlewares/authMiddleware");

/**
 * @openapi
 * /payments/overview:
 *   get:
 *     summary: Get sales overview for dashboard
 *     description: Returns revenue, transactions, failed payments, average transaction value, and chart data for 7/30/90 days.
 *     tags: ["Course - Payment"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [7, 30, 90]
 *           default: 7
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: Dashboard overview data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/overview",
  protect,
  authorize("admin", "superadmin"),
  paymentController.getAdminSalesOverview,
);

/**
 * @openapi
 * /payments/latest-transactions:
 *   get:
 *     summary: Get latest transactions for dashboard
 *     description: Returns latest successful transactions. Use limit query param for number of rows.
 *     tags: ["Course - Payment"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of transactions to return
 *     responses:
 *       200:
 *         description: Latest transactions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/latest-transactions",
  protect,
  authorize("admin", "superadmin"),
  paymentController.getLatestTransactions,
);

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
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of user payments
 */
router.get("/my-payments", protect, paymentController.getMyPayments);

/**
 * @openapi
 * /payments/all-payments:
 *   get:
 *     summary: Get all payments (admin)
 *     description: Returns a paginated list of all payments with the same fields as my-payments.
 *     tags: ["Course - Payment"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of all payments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/all-payments",
  protect,
  authorize("admin", "superadmin"),
  paymentController.getAllPayments,
);
module.exports = router;
