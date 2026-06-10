const courseRepository = require("./courseRepository");
const Wishlist = require("../courseWishList/wishlistModel");
const User = require("../user/userModel");
const Attempt = require("../attempt/attemptModel");
const Certificate = require("../certificate/certificateModel");
const Exam = require("../exam/examModel");

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

const getCourseDetailState = async (course, userId) => {
  const obj = course.toObject ? course.toObject() : course;

  let isPurchased = false;
  let progress = 0;
  let isVideoCompleted = false;

  if (obj.price === 0) {
    isPurchased = true;
  } else if (userId) {
    const user = await User.findById(userId).select("purchasedCourses");

    isPurchased =
      user?.purchasedCourses?.some(
        (id) => id.toString() === obj._id.toString(),
      ) || false;
  }

  if (userId) {
    const user = await User.findById(userId).select("courseProgress");

    const progressData = user?.courseProgress?.find(
      (p) => p.course?.toString() === obj._id.toString(),
    );

    if (progressData) {
      const watched = progressData.watchedSeconds || 0;
      const total = progressData.totalSeconds || 1;

      progress = Math.round((watched / total) * 100);
      isVideoCompleted = progressData.isCompleted;
    }
  }

  let examStatus = { taken: false };

  if (userId) {
    const exam = await Exam.findOne({ course: obj._id });
    if (exam) {
      const attempt = await Attempt.findOne({
        user: userId,
        exam: exam._id,
      });
      if (attempt) {
        examStatus = {
          taken: true,
          isPassed: attempt.isPassed,
        };
      }
    }
  }
  let examStatus = { taken: false };

  if (userId) {
    const exam = await Exam.findOne({ course: obj._id });
    if (exam) {
      const attempt = await Attempt.findOne({
        user: userId,
        exam: exam._id,
      });
      if (attempt) {
        examStatus = {
          taken: true,
          isPassed: attempt.isPassed,
        };
      }
    }
  }

  let certificate = { issued: false };

  if (userId) {
    const cert = await Certificate.findOne({
      user: userId,
      course: obj._id,
    });

    if (cert) {
      certificate = {
        issued: true,
        code: cert.code,
      };
    }
  }

  return {
    ...obj,
    isPurchased,
    progress,
    isVideoCompleted,
    examStatus,
    certificate,
  };
};

const getCourseById = async (id, userId) => {
  const course = await courseRepository.getCourseById(id);
  if (!course) return null;

  const base = await getCourseDetailState(course, userId);

  let isFavorite = false;

  if (userId) {
    const exists = await Wishlist.findOne({
      user: userId,
      course: id,
    }).lean();

    isFavorite = !!exists;
  }

  return {
    ...base,
    isFavorite,
  };
};

const updateCourse = async (id, updateData) => {
  return await courseRepository.updateCourse(id, updateData);
};

const deleteCourse = async (id) => {
  return await courseRepository.deleteCourse(id);
};

const getRelatedCourses = async (courseId, userId, limit = 6) => {
  const course = await courseRepository.getCourseById(courseId);

  if (!course) return [];

  const categoryIds = course.categories.map((c) =>
    c._id ? c._id.toString() : c.toString(),
  );

  const courses = await courseRepository.getRelatedCourses(
    courseId,
    categoryIds,
    limit,
  );

  if (!userId) return courses;

  const wishlistItems = await Wishlist.find({ user: userId }).select("course");
  const favoriteIds = wishlistItems.map((i) => i.course.toString());

  return courses.map((c) => {
    const obj = c.toObject ? c.toObject() : c;
    return {
      ...obj,
      isFavorite: favoriteIds.includes(obj._id.toString()),
    };
  });
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getRelatedCourses,
};
