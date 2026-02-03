// const courseService = require("./courseService");

// const createCourse = async (req, res, next) => {
//   try {
//     const files = req.files || {};
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

//     const courseImagePath = `/${files.courseImage[0].path.replace(/\\/g, "/")}`;
//     const teacherImagePath = `/${files.teacherImage[0].path.replace(
//       /\\/g,
//       "/"
//     )}`;

//     const { title, category, teacherName } = req.body;
//     const rating = req.body.rating !== undefined ? Number(req.body.rating) : 0;
//     const price = Number(req.body.price);

//     const createdBy = req.user ? req.user._id : undefined;

//     const payload = {
//       title,
//       category,
//       teacherName,
//       rating,
//       price,
//       courseImage: courseImagePath,
//       teacherImage: teacherImagePath,
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
//     res.status(200).json({ success: true, data: courses });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   createCourse,
//   getCourses,
// };
const courseService = require("./courseService");

const makeFullImageUrl = (req, imgPath) => {
  if (!imgPath) return imgPath;

  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return baseUrl + (imgPath.startsWith("/") ? imgPath : `/${imgPath}`);
};

const createCourse = async (req, res, next) => {
  try {
    const files = req.files || {};
    if (!files.courseImage || !files.courseImage[0]) {
      return res
        .status(400)
        .json({ success: false, message: "Course image is required" });
    }
    if (!files.teacherImage || !files.teacherImage[0]) {
      return res
        .status(400)
        .json({ success: false, message: "Teacher image is required" });
    }
    if (!files.courseVideo || !files.courseVideo[0]) {
      return res.status(400).json({
        success: false,
        message: "Course video is required",
      });
    }

    const courseVideoPath = `/${files.courseVideo[0].path.replace(/\\/g, "/")}`;
    const courseImagePath = `/${files.courseImage[0].path.replace(/\\/g, "/")}`;
    const teacherImagePath = `/${files.teacherImage[0].path.replace(
      /\\/g,
      "/",
    )}`;

    console.log("FILESSSS:");

    const { title, description, category, teacherName } = req.body;
    const rating = req.body.rating !== undefined ? Number(req.body.rating) : 0;
    const price = Number(req.body.price);

    const createdBy = req.user ? req.user._id : undefined;

    const payload = {
      title,
      description,
      category,
      teacherName,
      rating,
      price,
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
