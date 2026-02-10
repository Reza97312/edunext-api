const express = require("express");
const router = express.Router();
const { validateCreateCategory } = require("./categoryValidation");
const categoryController = require("./categoryController");
const { protect } = require("../../middlewares/authMiddleware");

router.get("/", categoryController.getCategories);

router.post(
  "/",
  protect,
  validateCreateCategory,
  categoryController.createCategory,
);

router.delete("/:id", protect, categoryController.deleteCategory);

module.exports = router;
