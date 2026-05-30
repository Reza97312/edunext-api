const Course = require("./courseModel");
const mongoose = require("mongoose");

const TEACHER_SELECT =
  "name email phoneNumber gender birthday about profileImage role";

const createCourse = async (courseData) => {
  const course = new Course(courseData);
  return await course.save();
};

const getAllCourses = async (filters = {}, options = {}) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 10);
  const skip = (page - 1) * limit;

  let sortObj = { createdAt: -1 };

  switch (options.sort) {
    case "oldest":
      sortObj = { createdAt: 1 };
      break;
    case "price_asc":
      sortObj = { price: 1 };
      break;
    case "price_desc":
      sortObj = { price: -1 };
      break;
    case "latest":
    default:
      sortObj = { createdAt: -1 };
  }

  const query = Course.find(filters)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate("categories", "name")
    .populate("courseLevel", "name")
    .populate("teacher", TEACHER_SELECT);

  const [data, total] = await Promise.all([
    query.exec(),
    Course.countDocuments(filters),
  ]);

  const pages = Math.max(1, Math.ceil(total / limit));

  return {
    data,
    meta: {
      total,
      page,
      pages,
      limit,
    },
  };
};

const getCourseById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Course.findById(id)
    .populate("categories", "name")
    .populate("courseLevel", "name")
    .populate("teacher", TEACHER_SELECT);
};

const updateCourse = async (id, updateData) => {
  return await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("categories", "name")
    .populate("courseLevel", "name")
    .populate("teacher", TEACHER_SELECT);
};

const deleteCourse = async (id) => {
  return await Course.findByIdAndDelete(id);
};

const getRelatedCourses = async (courseId, categoryIds, limit = 6) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) return [];

  return await Course.find({
    _id: { $ne: courseId },
    categories: { $in: categoryIds },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("categories", "name")
    .populate("courseLevel", "name")
    .populate("teacher", TEACHER_SELECT);
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getRelatedCourses,
};
