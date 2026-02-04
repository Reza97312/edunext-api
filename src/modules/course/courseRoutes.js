console.log("🔥 COURSE ROUTES LOADEDwww");
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { storage } = require("../../config/uploadConfig");
const { protect } = require("../../middlewares/authMiddleware");

const courseController = require("./courseController");
const { validateCreateCourse } = require("./courseValidation");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, UPLOADS_DIR);
//   },
//   filename: function (req, file, cb) {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${unique}${ext}`);
//   },
// });

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "courseImage" || file.fieldname === "teacherImage") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    return cb(null, true);
  }

  if (file.fieldname === "courseVideo") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed!"), false);
    }
    return cb(null, true);
  }

  cb(new Error("Invalid file field"), false);
};

const upload = multer({ storage: storage });

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

module.exports = router;
