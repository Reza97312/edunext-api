const categoryService = require("./categoryService");
const mongoose = require("mongoose");
const Course = require("../course/courseModel");

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existing = await categoryService.getCategoryByName(name);
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Category with this name already exists",
        });
    }

    const newCat = await categoryService.createCategory({ name, description });
    res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category id" });
    }

    const usedCount = await Course.countDocuments({ category: id });
    if (usedCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Category is used by existing courses. Remove or reassign those courses first.",
      });
    }

    const deleted = await categoryService.deleteCategory(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
