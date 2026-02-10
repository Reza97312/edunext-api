const repo = require("./courseLevelRepository");

const createCourseLevel = async (data) => {
  return await repo.createCourseLevel(data);
};
const getAllCourseLevels = async () => {
  return await repo.getAllCourseLevels();
};
const getCourseLevelById = async (id) => {
  return await repo.getCourseLevelById(id);
};
const deleteCourseLevel = async (id) => {
  return await repo.deleteCourseLevel(id);
};
const getCourseLevelByName = async (name) => {
  return await repo.getCourseLevelByName(name);
};

module.exports = {
  createCourseLevel,
  getAllCourseLevels,
  getCourseLevelById,
  deleteCourseLevel,
  getCourseLevelByName,
};
