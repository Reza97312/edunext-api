const paymentRepository = require("./paymentRepository");
const courseRepository = require("../course/courseRepository");
const User = require("../user/userModel");

const requestPayment = async (userId, courseId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) throw new Error("Course not found");

  if (course.price === 0) {
    throw new Error("This course is free. No payment required.");
  }

  const user = await User.findById(userId);
  if (user.purchasedCourses.includes(courseId)) {
    throw new Error("You have already purchased this course.");
  }

  const amount = course.price;

  const mockAuthority = `AUTH_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const paymentUrl = `https://sandbox.zarinpal.com/pg/StartPay/${mockAuthority}`;

  const payment = await paymentRepository.createPayment({
    user: userId,
    course: courseId,
    amount,
    authority: mockAuthority,
    status: "PENDING",
  });

  return { paymentUrl, paymentId: payment._id };
};

const verifyPayment = async (authority, status) => {
  const payment = await paymentRepository.findPaymentByAuthority(authority);
  if (!payment) throw new Error("Payment record not found");

  if (payment.status !== "PENDING") {
    throw new Error("This payment has already been processed");
  }

  if (status !== "OK") {
    await paymentRepository.updatePaymentStatus(payment._id, {
      status: "FAILED",
    });
    return { success: false, message: "Payment was canceled or failed" };
  }

  const isPaymentValid = true;
  const mockRefId = `REF_${Date.now()}`;

  if (isPaymentValid) {
    await paymentRepository.updatePaymentStatus(payment._id, {
      status: "SUCCESS",
      refId: mockRefId,
    });

    await User.findByIdAndUpdate(payment.user, {
      $addToSet: { purchasedCourses: payment.course },
    });

    return { success: true, refId: mockRefId, courseId: payment.course };
  } else {
    await paymentRepository.updatePaymentStatus(payment._id, {
      status: "FAILED",
    });
    return {
      success: false,
      message: "Payment verification failed at gateway",
    };
  }
};

const getUserPaymentHistory = async (userId) => {
  return await paymentRepository.getUserPayments(userId);
};

module.exports = {
  requestPayment,
  verifyPayment,
  getUserPaymentHistory,
};
