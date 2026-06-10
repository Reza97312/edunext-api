const repo = require("./questionRepository");
const Attempt = require("../attempt/attemptModel");
const Exam = require("../exam/examModel");

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

const createQuestionsBulk = async ({ examId, questions }) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new Error("Exam not found");
  }

  const hasAttempt = await Attempt.findOne({ exam: examId });
  if (hasAttempt) {
    throw new Error("Cannot add questions after attempts exist");
  }

  const payload = questions.map((q) => {
    if (!q.options.includes(q.correctAnswer)) {
      throw new Error(
        `Correct answer must be one of options for question: ${q.text}`,
      );
    }

    return {
      exam: examId,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
    };
  });

  return await repo.bulkCreateQuestions(payload);
};

module.exports = {
  createQuestion,
  createQuestionsBulk,
  getByExam,
  updateQuestion,
  deleteQuestion,
};
