const Course = require("./courseModel");

const createCourse = async (courseData) => {
  const course = new Course(courseData);
  return await course.save();
};

const getAllCourses = async () => {
  return await Course.find().sort({ createdAt: -1 });
};

module.exports = {
  createCourse,
  getAllCourses,
};
