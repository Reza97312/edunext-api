const courseRepository = require("./courseRepository");
const Wishlist = require("../courseWishList/wishlistModel");

const createCourse = async (data) => {
  return await courseRepository.createCourse(data);
};

const getAllCourses = async (filters, options = {}, userId) => {
  const result = await courseRepository.getAllCourses(filters, options);
  const courses = result.data || [];

  if (!userId) {
    const data = courses.map((c) => {
      const obj = c.toObject ? c.toObject() : c;
      return { ...obj, isFavorite: false };
    });
    return { ...result, data };
  }

  const wishlistItems = await Wishlist.find({ user: userId }).select("course");
  const favoriteIds = wishlistItems.map((i) => i.course.toString());

  const data = courses.map((c) => {
    const obj = c.toObject ? c.toObject() : c;
    return { ...obj, isFavorite: favoriteIds.includes(obj._id.toString()) };
  });

  return { ...result, data };
};

const getCourseById = async (id, userId) => {
  const course = await courseRepository.getCourseById(id);
  if (!course) return null;

  let isFavorite = false;
  if (userId) {
    const exists = await Wishlist.findOne({ user: userId, course: id }).lean();
    isFavorite = !!exists;
  }

  const obj = course.toObject ? course.toObject() : course;
  return { ...obj, isFavorite };
};

const updateCourse = async (id, updateData) => {
  return await courseRepository.updateCourse(id, updateData);
};

const deleteCourse = async (id) => {
  return await courseRepository.deleteCourse(id);
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
