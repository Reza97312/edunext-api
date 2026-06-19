const paymentRepository = require("./paymentRepository");
const courseRepository = require("../course/courseRepository");
const User = require("../user/userModel");

const normalizePeriod = (period) => {
  const allowed = [7, 30, 90];
  return allowed.includes(period) ? period : 7;
};

const buildDateRange = (days) => {
  const endDate = new Date();

  const end = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );

  const start = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate() - (days - 1),
      0,
      0,
      0,
      0,
    ),
  );

  return { startDate: start, endDate: end };
};

const buildPreviousRange = (days) => {
  const current = buildDateRange(days);
  const previousEnd = new Date(current.startDate);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousEnd.getDate() - days);

  return {
    startDate: previousStart,
    endDate: previousEnd,
  };
};

const percentageChange = (current, previous) => {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100;
  }

  const buildPaginationMeta = ({ total, page, limit }) => {
    const pages = Math.max(Math.ceil(total / limit), 1);

    return { total, page, pages, limit };
  };

  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const formatTrend = (rows, startDate, days) => {
  const map = new Map();

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setUTCDate(startDate.getUTCDate() + i);

    const key = d.toISOString().slice(0, 10);

    map.set(key, {
      revenue: 0,
      transactions: 0,
    });
  }

  rows.forEach((row) => {
    if (map.has(row._id)) {
      map.set(row._id, {
        revenue: row.revenue || 0,
        transactions: row.transactions || 0,
      });
    }
  });

  return Array.from(map.entries()).map(([date, value]) => ({
    date,
    ...value,
  }));
};

const requestPayment = async (userId, courseId) => {
  const course = await courseRepository.getCourseById(courseId);
  if (!course) throw new Error("Course not found");

  if (course.price === 0) throw new Error("This course is free.");

  const user = await User.findById(userId);
  if (user.purchasedCourses.includes(courseId)) {
    throw new Error("You have already purchased this course.");
  }

  const paypalToken = `EC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const paymentUrl = `${clientUrl}/checkout/paypal?token=${paypalToken}&amount=${course.price}&courseName=${encodeURIComponent(course.title)}`;

  const payment = await paymentRepository.createPayment({
    user: userId,
    course: courseId,
    amount: course.price,
    authority: paypalToken,
    status: "PENDING",
    gateway: "paypal",
  });

  return { paymentUrl, token: paypalToken };
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

    console.log(`Adding course ${payment.course} to user ${payment.user}`);

    const updatedUser = await User.findByIdAndUpdate(
      payment.user,
      { $addToSet: { purchasedCourses: payment.course } },
      { new: true },
    );

    console.log(
      "User's purchased courses after update:",
      updatedUser.purchasedCourses,
    );

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

const getUserPaymentHistory = async (userId, { page = 1, limit = 10 } = {}) => {
  const { data, total } = await paymentRepository.getUserPayments(userId, {
    page,
    limit,
  });

  return { data, meta: buildPaginationMeta({ total, page, limit }) };
};

const getAllPayments = async ({ page = 1, limit = 10 } = {}) => {
  const { data, total } = await paymentRepository.getAllPayments({
    page,
    limit,
  });

  return { data, meta: buildPaginationMeta({ total, page, limit }) };
};

const getAdminSalesOverview = async (period = 7) => {
  const days = normalizePeriod(Number(period));

  const currentRange = buildDateRange(days);
  const previousRange = buildPreviousRange(days);

  const [
    currentSummary,
    previousSummary,
    currentFailed,
    previousFailed,
    trendRows,
  ] = await Promise.all([
    paymentRepository.getPaymentSummaryInRange({
      startDate: currentRange.startDate,
      endDate: currentRange.endDate,
      status: "SUCCESS",
    }),
    paymentRepository.getPaymentSummaryInRange({
      startDate: previousRange.startDate,
      endDate: previousRange.endDate,
      status: "SUCCESS",
    }),
    paymentRepository.countPaymentsInRange({
      startDate: currentRange.startDate,
      endDate: currentRange.endDate,
      status: "FAILED",
    }),
    paymentRepository.countPaymentsInRange({
      startDate: previousRange.startDate,
      endDate: previousRange.endDate,
      status: "FAILED",
    }),
    paymentRepository.getRevenueTrendInRange({
      startDate: currentRange.startDate,
      endDate: currentRange.endDate,
      status: "SUCCESS",
    }),
  ]);

  const chartData = formatTrend(trendRows, currentRange.startDate, days);

  return {
    period: days,
    cards: {
      revenue: {
        value: currentSummary.revenue || 0,
        changePercent: percentageChange(
          currentSummary.revenue || 0,
          previousSummary.revenue || 0,
        ),
      },
      transactions: {
        value: currentSummary.transactions || 0,
        changePercent: percentageChange(
          currentSummary.transactions || 0,
          previousSummary.transactions || 0,
        ),
      },
      failedPayments: {
        value: currentFailed || 0,
        changePercent: percentageChange(
          currentFailed || 0,
          previousFailed || 0,
        ),
      },
      averageTransactionValue: {
        value: currentSummary.avgOrderValue || 0,
        changePercent: percentageChange(
          currentSummary.avgOrderValue || 0,
          previousSummary.avgOrderValue || 0,
        ),
      },
    },
    chart: {
      labels: chartData.map((item) => item.date),
      revenue: chartData.map((item) => item.revenue),
      transactions: chartData.map((item) => item.transactions),
    },
  };
};

const getLatestTransactions = async (limit = 5) => {
  return await paymentRepository.getLatestSuccessfulPayments(limit);
};

module.exports = {
  requestPayment,
  verifyPayment,
  getUserPaymentHistory,
  getLatestTransactions,
  getAdminSalesOverview,
  getAllPayments,
};
