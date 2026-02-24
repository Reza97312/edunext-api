const paymentService = require("./paymentService");

const requestPayment = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const result = await paymentService.requestPayment(userId, courseId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    if (
      err.message.includes("already purchased") ||
      err.message.includes("free")
    ) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

// const verifyPayment = async (req, res, next) => {
//   try {
//     const { Authority, Status } = req.query;

//     if (!Authority) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid request parameters" });
//     }

//     const result = await paymentService.verifyPayment(Authority, Status);

//     res.status(200).json(result);
//   } catch (err) {
//     next(err);
//   }
// };

const verifyPayment = async (req, res, next) => {
  try {
    const { token, PayerID } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token is missing from PayPal" });
    }

    const status = PayerID ? "OK" : "CANCELLED";

    const result = await paymentService.verifyPayment(token, status);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

    if (result.success) {
      return res.redirect(`${clientUrl}/payment/success?ref=${result.refId}`);
    } else {
      return res.redirect(`${clientUrl}/payment/cancel`);
    }
  } catch (err) {
    next(err);
  }
};

const getMyPayments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const payments = await paymentService.getUserPaymentHistory(userId);

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requestPayment,
  verifyPayment,
  getMyPayments,
};
