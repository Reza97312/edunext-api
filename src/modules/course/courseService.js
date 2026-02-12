const courseRepository = require("./courseRepository");

const createCourse = async (data) => {
  return await courseRepository.createCourse(data);
};

const getAllCourses = async (filters, sortOptions) => {
  return await courseRepository.getAllCourses(filters, sortOptions);
};
const getCourseById = async (id) => {
  return await courseRepository.getCourseById(id);
};

const updateCourse = async (id, updateData) => {
  return await courseRepository.updateCourse(id, updateData);
};

const deleteCourse = async (id) => {
  return await courseRepository.deleteCourse(id);
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
