const express = require("express");
const router = express.Router();
const { validateCreateCourseLevel } = require("./courseLevelValidation");
const controller = require("./courseLevelController");
const { protect } = require("../../middlewares/authMiddleware");

router.get("/", controller.getCourseLevels);

router.post(
  "/",
  protect,
  validateCreateCourseLevel,
  controller.createCourseLevel,
);

router.delete("/:id", protect, controller.deleteCourseLevel);

module.exports = router;
