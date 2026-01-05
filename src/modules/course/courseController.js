const courseService = require("./courseService");

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

    const courseImagePath = `/${files.courseImage[0].path.replace(/\\/g, "/")}`;
    const teacherImagePath = `/${files.teacherImage[0].path.replace(
      /\\/g,
      "/"
    )}`;

    const { title, category, teacherName } = req.body;
    const rating = req.body.rating !== undefined ? Number(req.body.rating) : 0;
    const price = Number(req.body.price);

    const createdBy = req.user ? req.user._id : undefined;

    const payload = {
      title,
      category,
      teacherName,
      rating,
      price,
      courseImage: courseImagePath,
      teacherImage: teacherImagePath,
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
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCourse,
  getCourses,
};
