const Question = require("./questionModel");

const createQuestion = async (data) => {
  return await Question.create(data);
};

const getByExam = async (examId) => {
  return await Question.find({ exam: examId });
};

const getQuestionById = async (id) => {
  return await Question.findById(id);
};

const updateQuestion = async (id, data) => {
  return await Question.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteQuestion = async (id) => {
  return await Question.findByIdAndDelete(id);
};

module.exports = {
  createQuestion,
  getByExam,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
