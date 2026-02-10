const service = require("./courseLevelService");
const mongoose = require("mongoose");
const Course = require("../course/courseModel");

const createCourseLevel = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existing = await service.getCourseLevelByName(name);
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Level already exists" });
    }

    const newLevel = await service.createCourseLevel({ name, description });
    res.status(201).json({ success: true, data: newLevel });
  } catch (err) {
    next(err);
  }
};

const getCourseLevels = async (req, res, next) => {
  try {
    const levels = await service.getAllCourseLevels();
    res.status(200).json({ success: true, data: levels });
  } catch (err) {
    next(err);
  }
};

const deleteCourseLevel = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid level id" });
    }

    const usedCount = await Course.countDocuments({ courseLevel: id });
    if (usedCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Course level is used by existing courses. Reassign or remove those courses first.",
      });
    }

    const deleted = await service.deleteCourseLevel(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Course level not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Course level deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCourseLevel,
  getCourseLevels,
  deleteCourseLevel,
};
