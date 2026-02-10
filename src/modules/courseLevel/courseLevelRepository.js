const CourseLevel = require("./courseLevelModel");
const mongoose = require("mongoose");

const createCourseLevel = async (data) => {
  const cl = new CourseLevel(data);
  return await cl.save();
};

const getAllCourseLevels = async () => {
  return await CourseLevel.find().sort({ createdAt: -1 });
};

const getCourseLevelById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await CourseLevel.findById(id);
};

const getCourseLevelByName = async (name) => {
  return await CourseLevel.findOne({ name });
};

const deleteCourseLevel = async (id) => {
  return await CourseLevel.findByIdAndDelete(id);
};

module.exports = {
  createCourseLevel,
  getAllCourseLevels,
  getCourseLevelById,
  getCourseLevelByName,
  deleteCourseLevel,
};
