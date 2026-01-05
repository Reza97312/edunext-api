console.log("🔥 COURSE ROUTES LOADED");
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const { protect } = require("../../middlewares/authMiddleware");

const courseController = require("./courseController");
const { validateCreateCourse } = require("./courseValidation");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed!"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

router.post(
  "/",
  protect,
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "teacherImage", maxCount: 1 },
  ]),
  validateCreateCourse,
  courseController.createCourse
);

router.get("/", courseController.getCourses);

module.exports = router;
