const repo = require("./examRepository");
const Attempt = require("../attempt/attemptModel");
const Question = require("../question/questionModel");

const createExam = async (data) => {
  return await repo.createExam(data);
};

const getExamByCourse = async (courseId) => {
  return await repo.getExamByCourse(courseId);
};

const getExamById = async (id) => {
  return await repo.getExamById(id);
};

const updateExam = async (id, data) => {
  const exam = await repo.getExamById(id);
  if (!exam) {
    throw new Error("Exam not found");
  }

  const allowedData = {
    title: data.title,
    passingScore: data.passingScore,
    timeLimit: data.timeLimit,
  };

  Object.keys(allowedData).forEach((key) => {
    if (allowedData[key] === undefined) {
      delete allowedData[key];
    }
  });

  return await repo.updateExam(id, allowedData);
};

const deleteExam = async (id) => {
  const exam = await repo.getExamById(id);
  if (!exam) {
    throw new Error("Exam not found");
  }

  const hasAttempt = await Attempt.findOne({ exam: id });
  if (hasAttempt) {
    throw new Error("Cannot delete exam with attempts");
  }

  await Question.deleteMany({ exam: id });

  return await repo.deleteExam(id);
};

module.exports = {
  createExam,
  getExamByCourse,
  getExamById,
  updateExam,
  deleteExam,
};
