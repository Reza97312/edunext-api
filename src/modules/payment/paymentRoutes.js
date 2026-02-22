const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");
const { protect } = require("../../middlewares/authMiddleware");

router.post("/request", protect, paymentController.requestPayment);

router.get("/verify", paymentController.verifyPayment);

router.get("/my-payments", protect, paymentController.getMyPayments);

module.exports = router;
