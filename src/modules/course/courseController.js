// const courseService = require("./courseService");
// const path = require("path");

// const makeFullImageUrl = (req, imgPath) => {
//   if (!imgPath) return imgPath;

//   if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
//     return imgPath;
//   }
//   const baseUrl = `${req.protocol}://${req.get("host")}`;

//   const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
//   return baseUrl + cleanPath;
// };

// const createCourse = async (req, res, next) => {
//   try {
//     const files = req.files || {};

//     // Cloudinary آدرس کامل (URL) رو مستقیم اینجا میذاره
//     const courseImagePath = files.courseImage
//       ? files.courseImage[0].path
//       : null;
//     const teacherImagePath = files.teacherImage
//       ? files.teacherImage[0].path
//       : null;
//     const courseVideoPath = files.courseVideo
//       ? files.courseVideo[0].path
//       : null;

//     if (!courseImagePath || !teacherImagePath || !courseVideoPath) {
//       return res.status(400).json({
//         success: false,
//         message: "All files (Image, Teacher Image, Video) are required",
//       });
//     }

//     const { title, description, category, teacherName, rating, price } =
//       req.body;
//     const createdBy = req.user ? req.user._id : undefined;

//     const payload = {
//       title,
//       description,
//       category,
//       teacherName,
//       rating: Number(rating) || 0,
//       price: Number(price) || 0,
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

// const getCourses = async (req, res, next) => {
//   try {
//     const courses = await courseService.getAllCourses();

//     const mapped = courses.map((c) => ({
//       _id: c._id,
//       title: c.title,
//       description: c.description,
//       category: c.category,
//       teacherName: c.teacherName,
//       rating: c.rating,
//       price: c.price,
//       courseImage: makeFullImageUrl(req, c.courseImage),
//       teacherImage: makeFullImageUrl(req, c.teacherImage),
//       createdBy: c.createdBy,
//       createdAt: c.createdAt,
//       updatedAt: c.updatedAt,
//     }));
//     res.status(200).json({ success: true, data: mapped });
//   } catch (err) {
//     next(err);
//   }
// };

// const getCourseById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const course = await courseService.getCourseById(id);

//     if (!course) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Course not found" });
//     }

//     const result = {
//       _id: course._id,
//       title: course.title,
//       description: course.description,
//       category: course.category,
//       teacherName: course.teacherName,
//       rating: course.rating,
//       price: course.price,
//       courseImage: makeFullImageUrl(req, course.courseImage),
//       teacherImage: makeFullImageUrl(req, course.teacherImage),
//       courseVideo: makeFullImageUrl(req, course.courseVideo),
//       createdBy: course.createdBy,
//       createdAt: course.createdAt,
//       updatedAt: course.updatedAt,
//     };

//     res.status(200).json({ success: true, data: result });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   createCourse,
//   getCourses,
//   getCourseById,
// };
const courseService = require("./courseService");

// این تابع را نگه می‌داریم فقط برای دوره‌های قدیمی که ممکن است هنوز لینک کامل ندارند
const makeFullImageUrl = (req, imgPath) => {
  if (!imgPath) return imgPath;

  // اگر لینک از قبل کامل است (Cloudinary)، همان را برگردان
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }

  // اگر لینک هنوز مربوط به هاست شخصی (Render) است
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  return baseUrl + cleanPath;
};

const createCourse = async (req, res, next) => {
  try {
    const files = req.files || {};

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
      return res.status(400).json({
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
      courseImage: courseImagePath,
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
      ...(c.toObject ? c.toObject() : c), // برای اطمینان از تبدیل دیتای مونگو به آبجکت
      courseImage: makeFullImageUrl(req, c.courseImage),
      teacherImage: makeFullImageUrl(req, c.teacherImage),
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

    // تبدیل به دیتای ساده برای فرستادن به کلاینت
    const courseData = course.toObject ? course.toObject() : course;

    const result = {
      ...courseData,
      courseImage: makeFullImageUrl(req, course.courseImage),
      teacherImage: makeFullImageUrl(req, course.teacherImage),
      courseVideo: makeFullImageUrl(req, course.courseVideo),
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
