const Course = require("../course/courseModel");
const User = require("../user/userModel");

const countCourses = async () => {
  return await Course.countDocuments();
};

const countTeachers = async () => {
  return await User.countDocuments({
    role: { $in: ["teacher"] },
  });
};

const countStudents = async () => {
  return await User.countDocuments({
    role: { $size: 1, $all: ["user"] },
  });
};

module.exports = {
  countCourses,
  countTeachers,
  countStudents,
};
