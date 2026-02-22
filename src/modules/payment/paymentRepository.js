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

const getUserPayments = async (userId) => {
  return await Payment.find({ user: userId })
    .populate("course", "title price courseImage")
    .sort({ createdAt: -1 });
};

module.exports = {
  createPayment,
  findPaymentByAuthority,
  updatePaymentStatus,
  getUserPayments,
};
