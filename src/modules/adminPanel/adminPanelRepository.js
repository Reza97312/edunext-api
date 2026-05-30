const AdminPanel = require("./adminPanelModel");
const User = require("../user/userModel");
const Course = require("../course/courseModel");
const Payment = require("../payment/paymentModel");

const getMonthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);

  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return { start, end };
};

const getPreviousMonthRange = () => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const end = new Date(now.getFullYear(), now.getMonth(), 1);

  return { start, end };
};

const countStudentsInRange = async (startDate, endDate) => {
  return await User.countDocuments({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },

    $and: [
      { role: "user" },
      { role: { $nin: ["teacher", "admin", "superadmin", "moderator"] } },
    ],
  });
};

const countCoursesInRange = async (startDate, endDate) => {
  return await Course.countDocuments({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });
};

const getRevenueInRange = async (startDate, endDate) => {
  const result = await Payment.aggregate([
    {
      $match: {
        status: "SUCCESS",
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return result[0]?.revenue || 0;
};

const countStudents = async () => {
  return await User.countDocuments({
    $and: [
      { role: "user" },
      { role: { $nin: ["teacher", "admin", "superadmin", "moderator"] } },
    ],
  });
};

const countCourses = async () => {
  return await Course.countDocuments({});
};

const countSoldCourses = async () => {
  return await Payment.countDocuments({ status: "SUCCESS" });
};

const getSettings = async () => {
  return await AdminPanel.findOne();
};

const createSettings = async (data) => {
  return await AdminPanel.create(data);
};

const updateSettings = async (updateData) => {
  return await AdminPanel.findOneAndUpdate({}, updateData, {
    new: true,
    upsert: true,
    runValidators: true,
  });
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
  countStudents,
  countCourses,
  countSoldCourses,
  getMonthRange,
  getPreviousMonthRange,
  countStudentsInRange,
  countCoursesInRange,
  getRevenueInRange,
};
