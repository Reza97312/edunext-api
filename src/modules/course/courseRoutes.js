const express = require("express");
const router = express.Router();
// const path = require("path");
const { upload } = require("../../config/uploadConfig");
// const { storage } = require("../../config/uploadConfig");
const { protect } = require("../../middlewares/authMiddleware");

const courseController = require("./courseController");
const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("./courseValidation");

// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === "courseImage" || file.fieldname === "teacherImage") {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only image files are allowed!"), false);
//     }
//     return cb(null, true);
//   }

//   if (file.fieldname === "courseVideo") {
//     if (!file.mimetype.startsWith("video/")) {
//       return cb(new Error("Only video files are allowed!"), false);
//     }
//     return cb(null, true);
//   }

//   cb(new Error("Invalid file field"), false);
// };

// const upload = multer({ storage: storage });

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

router.get("/", courseController.getCourses);

router.get("/:id", courseController.getCourseById);

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
