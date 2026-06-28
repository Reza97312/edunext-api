const paymentService = require("./paymentService");

const getAdminSalesOverview = async (req, res, next) => {
  try {
    const period = Number(req.query.period) || 7;

    const result = await paymentService.getAdminSalesOverview(period);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getLatestTransactions = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const result = await paymentService.getLatestTransactions(limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

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

const verifyPayment = async (req, res, next) => {
  try {
    const { token, PayerID } = req.query;

    if (!token) {
      const clientUrl =
        process.env.CLIENT_URL || "https://edu-next-nu.vercel.app";
      return res.redirect(`${clientUrl}/payment/cancel?reason=missing_token`);
    }

    const status = PayerID ? "OK" : "CANCELLED";

    const result = await paymentService.verifyPayment(token, status);
    const clientUrl =
      process.env.CLIENT_URL || "https://edu-next-nu.vercel.app";

    if (result.success) {
      return res.redirect(`${clientUrl}/payment/success?ref=${result.refId}`);
    } else {
      return res.redirect(`${clientUrl}/payment/cancel`);
    }
  } catch (err) {
    const clientUrl =
      process.env.CLIENT_URL || "https://edu-next-nu.vercel.app";

    if (err.message.includes("already been processed")) {
      return res.redirect(
        `${clientUrl}/payment/cancel?error=already_processed`,
      );
    }

    return res.redirect(`${clientUrl}/payment/cancel?error=server_error`);
  }
};

const getMyPayments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await paymentService.getUserPaymentHistory(userId, {
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await paymentService.getAllPayments({ page, limit });

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requestPayment,
  verifyPayment,
  getMyPayments,
  getAllPayments,
  getAdminSalesOverview,
  getLatestTransactions,
};
