const teacherRepository = require("./teacherRepository");

const getAllTeachers = async (query) => {
  return teacherRepository.getAllTeachers(query);
};

const getTeacherById = async (id) => {
  return teacherRepository.getTeacherById(id);
};

module.exports = {
  getAllTeachers,
  getTeacherById,
};
