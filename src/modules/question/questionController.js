const service = require("./questionService");

const createQuestion = async (req, res, next) => {
  try {
    const q = await service.createQuestion(req.body);
    res.status(201).json({ success: true, data: q });
  } catch (err) {
    next(err);
  }
};

const createQuestionsBulk = async (req, res, next) => {
  try {
    const result = await service.createQuestionsBulk(req.body);

    res.status(201).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getByExam = async (req, res, next) => {
  try {
    const data = await service.getByExam(req.params.examId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const data = await service.updateQuestion(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    await service.deleteQuestion(req.params.id);
    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createQuestion,
  getByExam,
  updateQuestion,
  deleteQuestion,
  createQuestionsBulk,
};
