// const express = require("express");
// const router = express.Router();
// const { validateCreateCategory } = require("./categoryValidation");
// const categoryController = require("./categoryController");
// const { protect } = require("../../middlewares/authMiddleware");

// router.get("/", categoryController.getCategories);

// router.post(
//   "/",
//   protect,
//   validateCreateCategory,
//   categoryController.createCategory,
// );

// router.delete("/:id", protect, categoryController.deleteCategory);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { validateCreateCategory } = require("./categoryValidation");
const categoryController = require("./categoryController");
const { protect } = require("../../middlewares/authMiddleware");

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: ["Course - Category"]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", categoryController.getCategories);

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: ["Course - Category"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Programming
 *               description:
 *                 type: string
 *                 example: Courses related to programming
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error or duplicate category
 */
router.post(
  "/",
  protect,
  validateCreateCategory,
  categoryController.createCategory,
);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: ["Course - Category"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid id or category in use
 *       404:
 *         description: Category not found
 */
router.delete("/:id", protect, categoryController.deleteCategory);

module.exports = router;
