const Category = require("./categoryModel");
const mongoose = require("mongoose");

const createCategory = async (data) => {
  const cat = new Category(data);
  return await cat.save();
};

const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

const getCategoryById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Category.findById(id);
};

const getCategoryByName = async (name) => {
  return await Category.findOne({ name });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  deleteCategory,
};
