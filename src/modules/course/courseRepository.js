const Course = require("./courseModel");
const mongoose = require("mongoose");

const createCourse = async (courseData) => {
  const course = new Course(courseData);
  return await course.save();
};

const getAllCourses = async (filter = {}, options = {}) => {
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

  const query = Course.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate("categories", "name")
    .populate("courseLevel", "name");

  const [data, total] = await Promise.all([
    query.exec(),
    Course.countDocuments(filter),
  ]);
  const pages = Math.ceil(total / limit) || 1;

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
    .populate("courseLevel", "name");
};

const updateCourse = async (id, updateData) => {
  return await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("categories", "name")
    .populate("courseLevel", "name");
};

const deleteCourse = async (id) => {
  return await Course.findByIdAndDelete(id);
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
