const express = require("express");
const router = express.Router();
const { upload } = require("../../config/uploadConfig");
const {
  protect,
  optionalProtect,
} = require("../../middlewares/authMiddleware");

const courseController = require("./courseController");
const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("./courseValidation");

router.post(
  "/",
  protect,
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "teacherImage", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  validateCreateCourse,
  courseController.createCourse,
);

router.get("/", optionalProtect, courseController.getCourses);

router.get("/:id", optionalProtect, courseController.getCourseById);

router.delete("/:id", protect, courseController.deleteCourse);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "teacherImage", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  validateUpdateCourse,
  courseController.updateCourse,
);

module.exports = router;
