const Course = require("./courseModel");
const mongoose = require("mongoose");

const createCourse = async (courseData) => {
  const course = new Course(courseData);
  return await course.save();
};

const getAllCourses = async () => {
  return await Course.find().sort({ createdAt: -1 });
};

const getCourseById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Course.findById(id);
};

const updateCourse = async (id, updateData) => {
  return await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteCourse = async (id) => {
  return await Course.findByIdAndDelete(id);
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
