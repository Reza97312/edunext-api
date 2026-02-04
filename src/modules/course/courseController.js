const courseService = require("./courseService");
const path = require("path");

const makeFullImageUrl = (req, imgPath) => {
  if (!imgPath) return imgPath;

  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  return baseUrl + cleanPath;
};

// const createCourse = async (req, res, next) => {
//   try {
//     const files = req.files || {};

//     // ولیدیشن وجود فایل‌ها
//     if (!files.courseImage || !files.courseImage[0]) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Course image is required" });
//     }
//     if (!files.teacherImage || !files.teacherImage[0]) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Teacher image is required" });
//     }

//     const courseImagePath = `/uploads/${files.courseImage[0].filename}`;
//     const teacherImagePath = `/uploads/${files.teacherImage[0].filename}`;

//     let courseVideoPath = null;
//     if (files.courseVideo && files.courseVideo[0]) {
//       courseVideoPath = `/uploads/${files.courseVideo[0].filename}`;
//     }
//     // ---------------------------

//     console.log("FILES SAVED AS:", {
//       courseImagePath,
//       teacherImagePath,
//       courseVideoPath,
//     });

//     const { title, description, category, teacherName } = req.body;
//     const rating = req.body.rating !== undefined ? Number(req.body.rating) : 0;
//     const price = Number(req.body.price);

//     const createdBy = req.user ? req.user._id : undefined;

//     const payload = {
//       title,
//       description,
//       category,
//       teacherName,
//       rating,
//       price,
//       courseImage: courseImagePath,
//       teacherImage: teacherImagePath,
//       courseVideo: courseVideoPath,
//       createdBy,
//     };

//     const course = await courseService.createCourse(payload);

//     res.status(201).json({ success: true, data: course });
//   } catch (err) {
//     next(err);
//   }
// };

const createCourse = async (req, res, next) => {
  try {
    const files = req.files || {};

    // Cloudinary آدرس کامل (URL) رو مستقیم اینجا میذاره
    const courseImagePath = files.courseImage
      ? files.courseImage[0].path
      : null;
    const teacherImagePath = files.teacherImage
      ? files.teacherImage[0].path
      : null;
    const courseVideoPath = files.courseVideo
      ? files.courseVideo[0].path
      : null;

    if (!courseImagePath || !teacherImagePath || !courseVideoPath) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All files (Image, Teacher Image, Video) are required",
        });
    }

    const { title, description, category, teacherName, rating, price } =
      req.body;
    const createdBy = req.user ? req.user._id : undefined;

    const payload = {
      title,
      description,
      category,
      teacherName,
      rating: Number(rating) || 0,
      price: Number(price) || 0,
      courseImage: courseImagePath, // این دیگه خودش https://res.cloudinary... هست
      teacherImage: teacherImagePath,
      courseVideo: courseVideoPath,
      createdBy,
    };

    const course = await courseService.createCourse(payload);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses();

    const mapped = courses.map((c) => ({
      _id: c._id,
      title: c.title,
      description: c.description,
      category: c.category,
      teacherName: c.teacherName,
      rating: c.rating,
      price: c.price,
      courseImage: makeFullImageUrl(req, c.courseImage),
      teacherImage: makeFullImageUrl(req, c.teacherImage),
      createdBy: c.createdBy,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
    res.status(200).json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const result = {
      _id: course._id,
      title: course.title,
      description: course.description,
      category: course.category,
      teacherName: course.teacherName,
      rating: course.rating,
      price: course.price,
      courseImage: makeFullImageUrl(req, course.courseImage),
      teacherImage: makeFullImageUrl(req, course.teacherImage),
      courseVideo: makeFullImageUrl(req, course.courseVideo),
      createdBy: course.createdBy,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
};
