const courseRepository = require("./courseRepository");

const createCourse = async (data) => {
  return await courseRepository.createCourse(data);
};

const getAllCourses = async () => {
  return await courseRepository.getAllCourses();
};
const getCourseById = async (id) => {
  return await courseRepository.getCourseById(id);
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
};
