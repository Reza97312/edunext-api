const service = require("./attemptService");

const submitExam = async (req, res, next) => {
  try {
    const result = await service.submitExam(
      req.user._id,
      req.body.examId,
      req.body.answers,
      req.body.isAutoSubmitted || false,
    );

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitExam };
