const Exam = require("./examModel");

const createExam = async (data) => {
  return await Exam.create(data);
};

const getExamByCourse = async (courseId) => {
  return await Exam.findOne({ course: courseId }).populate("course");
};

const getExamById = async (id) => {
  return await Exam.findById(id).populate("course");
};

const updateExam = async (id, data) => {
  return await Exam.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteExam = async (id) => {
  return await Exam.findByIdAndDelete(id);
};

module.exports = {
  createExam,
  getExamByCourse,
  getExamById,
  deleteExam,
  updateExam,
};
