const service = require("./examService");

const createExam = async (req, res, next) => {
  try {
    const exam = await service.createExam(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

const getExamByCourse = async (req, res, next) => {
  try {
    const exam = await service.getExamByCourse(req.params.courseId);
    res.status(200).json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

const updateExam = async (req, res, next) => {
  try {
    const exam = await service.updateExam(req.params.id, req.body);
    res.status(200).json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

const deleteExam = async (req, res, next) => {
  try {
    await service.deleteExam(req.params.id);
    res.status(200).json({ success: true, message: "Exam deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createExam,
  getExamByCourse,
  updateExam,
  deleteExam,
};
