const Payment = require("./paymentModel");

const createPayment = async (paymentData) => {
  return await Payment.create(paymentData);
};

const findPaymentByAuthority = async (authority) => {
  return await Payment.findOne({ authority });
};

const updatePaymentStatus = async (id, updateData) => {
  return await Payment.findByIdAndUpdate(id, updateData, { new: true });
};

const getUserPayments = async (userId, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Payment.find({ user: userId })
      .populate("course", "title price courseImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments({ user: userId }),
  ]);

  return { data, total };
};

const getAllPayments = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Payment.find({})
      .populate("course", "title price courseImage")
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments({}),
  ]);

  return { data, total };
};

const getLatestSuccessfulPayments = async (limit = 5) => {
  return await Payment.find({ status: "SUCCESS" })
    .populate("user", "name email")
    .populate("course", "title price courseImage")
    .sort({ createdAt: -1 })
    .limit(limit);
};

const getPaymentSummaryInRange = async ({
  startDate,
  endDate,
  status = "SUCCESS",
}) => {
  const result = await Payment.aggregate([
    {
      $match: {
        status,
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$amount" },
        transactions: { $sum: 1 },
        avgOrderValue: { $avg: "$amount" },
      },
    },
  ]);

  return result[0] || { revenue: 0, transactions: 0, avgOrderValue: 0 };
};

const countPaymentsInRange = async ({ startDate, endDate, status }) => {
  return await Payment.countDocuments({
    status,
    createdAt: { $gte: startDate, $lt: endDate },
  });
};

const getRevenueTrendInRange = async ({
  startDate,
  endDate,
  status = "SUCCESS",
}) => {
  return await Payment.aggregate([
    {
      $match: {
        status,
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        revenue: { $sum: "$amount" },
        transactions: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

module.exports = {
  createPayment,
  findPaymentByAuthority,
  updatePaymentStatus,
  getUserPayments,
  getLatestSuccessfulPayments,
  getPaymentSummaryInRange,
  countPaymentsInRange,
  getRevenueTrendInRange,
  getAllPayments,
};
