const User = require("../user/userModel");
const Course = require("../course/courseModel");

const TEACHER_SELECT =
  "name email phoneNumber gender birthday about profileImage role createdAt";

const getAllTeachers = async ({ page = 1, limit = 10, search = "" } = {}) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);
  const skip = (page - 1) * limit;

  const filter = { role: "teacher" };

  if (search && search.trim()) {
    const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: safe, $options: "i" } },
      { email: { $regex: safe, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    User.find(filter)
      .select(TEACHER_SELECT)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      limit,
    },
  };
};

const getTeacherById = async (id) => {
  const teacher = await User.findOne({ _id: id, role: "teacher" })
    .select(TEACHER_SELECT)
    .lean();

  if (teacher) {
    const courses = await Course.find({ teacher: id })
      .select("courseImage categories title rating price")
      .populate("categories", "name")
      .lean();

    teacher.courses = courses;
  }

  return teacher;
};

module.exports = {
  getAllTeachers,
  getTeacherById,
};
