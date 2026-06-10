const Attempt = require("./attemptModel");
const Question = require("../question/questionModel");
const Exam = require("../exam/examModel");
const Certificate = require("../certificate/certificateModel");
const CertificateService = require("../certificate/certificateService");

const submitExam = async (userId, examId, answers, isAutoSubmitted = false) => {
  const exam = await Exam.findById(examId);
  if (!exam) throw new Error("Exam not found");

  const passedAttempt = await Attempt.findOne({
    user: userId,
    exam: examId,
    isPassed: true,
  });

  if (passedAttempt) throw new Error("You already passed this exam");

  const questions = await Question.find({ exam: examId });
  if (!questions || questions.length === 0) {
    throw new Error("No questions found for this exam");
  }

  // let score = 0;

  // questions.forEach((q) => {
  //   const userAnswer = answers.find(
  //     (a) => a.questionId.toString() === q._id.toString(),
  //   );

  //   if (userAnswer && userAnswer.answer === q.correctAnswer) {
  //     score += q.score;
  //   }
  // });

  // const totalScore = questions.reduce((acc, q) => acc + q.score, 0);

  // if (totalScore === 0) {
  //   throw new Error("Invalid exam scoring configuration");
  // }

  // const percent = (score / totalScore) * 100;
  // const isPassed = percent >= exam.passingScore;

  let correctCount = 0;
  questions.forEach((q) => {
    const userAnswer = answers.find(
      (a) => a.questionId.toString() === q._id.toString(),
    );
    if (userAnswer && userAnswer.answer === q.correctAnswer) {
      correctCount++;
    }
  });

  const percent = (correctCount / questions.length) * 100;
  const isPassed = percent >= exam.passingScore;

  // let certificate = null;

  // if (isPassed) {
  //   const existingCertificate = await Certificate.findOne({
  //     user: userId,
  //     course: exam.course,
  //   });

  //   if (existingCertificate) {
  //     certificate = existingCertificate;
  //   } else {
  //     certificate = await CertificateService.createCertificate(
  //       userId,
  //       exam.course,
  //     );
  //   }
  // }

  let certificate = null;
  if (isPassed) {
    const existing = await Certificate.findOne({
      user: userId,
      course: exam.course,
    });
    certificate = existing
      ? existing
      : await CertificateService.createCertificate(userId, exam.course);
  }

  const attempt = await Attempt.create({
    user: userId,
    exam: examId,
    answers,
    score: percent,
    isPassed,
    isAutoSubmitted,
  });

  return {
    attempt,
    certificate,
  };
};

module.exports = { submitExam };
