const categoryRepository = require("./categoryRepository");

const createCategory = async (data) => {
  return await categoryRepository.createCategory(data);
};

const getAllCategories = async () => {
  return await categoryRepository.getAllCategories();
};

const getCategoryById = async (id) => {
  return await categoryRepository.getCategoryById(id);
};

const getCategoryByName = async (name) => {
  return await categoryRepository.getCategoryByName(name);
};

const deleteCategory = async (id) => {
  return await categoryRepository.deleteCategory(id);
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  deleteCategory,
};
