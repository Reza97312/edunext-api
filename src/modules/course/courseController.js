const courseService = require("./courseService");

const makeFullImageUrl = (req, imgPath) => {
  if (!imgPath) return imgPath;

  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }

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
      ...(c.toObject ? c.toObject() : c),
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

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCourse = await courseService.deleteCourse(id);

    if (!deletedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files || {};

    let updateData = { ...req.body };

    if (files.courseImage) updateData.courseImage = files.courseImage[0].path;
    if (files.teacherImage)
      updateData.teacherImage = files.teacherImage[0].path;
    if (files.courseVideo) updateData.courseVideo = files.courseVideo[0].path;

    const updatedCourse = await courseService.updateCourse(id, updateData);

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
};
