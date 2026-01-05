const courseRepository = require("./courseRepository");

const createCourse = async (data) => {
  return await courseRepository.createCourse(data);
};

const getAllCourses = async () => {
  return await courseRepository.getAllCourses();
};

module.exports = {
  createCourse,
  getAllCourses,
};
