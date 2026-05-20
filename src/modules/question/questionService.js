const repo = require("./questionRepository");
const Attempt = require("../attempt/attemptModel");

const createQuestion = async (data) => {
  return await repo.createQuestion(data);
};

const getByExam = async (examId) => {
  return await repo.getByExam(examId);
};

const updateQuestion = async (id, data) => {
  const question = await repo.getQuestionById(id);
  if (!question) {
    throw new Error("Question not found");
  }

  const hasAttempt = await Attempt.findOne({ exam: question.exam });
  if (hasAttempt) {
    throw new Error("Cannot update question after attempts exist");
  }

  return await repo.updateQuestion(id, data);
};

const deleteQuestion = async (id) => {
  const question = await repo.getQuestionById(id);
  if (!question) {
    throw new Error("Question not found");
  }

  const hasAttempt = await Attempt.findOne({ exam: question.exam });
  if (hasAttempt) {
    throw new Error("Cannot delete question after attempts exist");
  }

  return await repo.deleteQuestion(id);
};

module.exports = {
  createQuestion,
  getByExam,
  updateQuestion,
  deleteQuestion,
};
