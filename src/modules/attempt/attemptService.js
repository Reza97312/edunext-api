const Attempt = require("./attemptModel");
const Question = require("../question/questionModel");
const Exam = require("../exam/examModel");
const CertificateService = require("../certificate/certificateService");

const submitExam = async (userId, examId, answers) => {
  const questions = await Question.find({ exam: examId });
  const exam = await Exam.findById(examId);

  let score = 0;

  questions.forEach((q) => {
    // const userAnswer = answers.find((a) => a.questionId === q._id.toString());
    const userAnswer = answers.find(
      (a) => a.questionId.toString() === q._id.toString(),
    );

    if (userAnswer && userAnswer.answer === q.correctAnswer) {
      score += q.score;
    }
  });

  const totalScore = questions.reduce((acc, q) => acc + q.score, 0);
  const percent = (score / totalScore) * 100;

  const isPassed = percent >= exam.passingScore;

  let certificate = null;

  if (isPassed) {
    certificate = await CertificateService.createCertificate(
      userId,
      exam.course,
    );
  }

  const attempt = await Attempt.create({
    user: userId,
    exam: examId,
    answers,
    score: percent,
    isPassed,
  });

  return {
    attempt,
    certificate,
  };
};

module.exports = { submitExam };
