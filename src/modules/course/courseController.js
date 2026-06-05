const courseService = require("./courseService");
const mongoose = require("mongoose");
const Category = require("../category/categoryModel");
const CourseLevel = require("../courseLevel/courseLevelModel");
const User = require("../user/userModel");
const Course = require("./courseModel");

const makeFullImageUrl = (req, imgPath) => {
  if (!imgPath) return imgPath;

  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  return baseUrl + cleanPath;
};

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const normalizeCategoriesInput = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}

    if (raw.includes(",")) {
      return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [raw.trim()];
  }
  return [];
};

const resolveTeacher = async (req) => {
  const currentUser = req.user;

  const isAdmin = currentUser.role.includes("admin");
  const isSuperAdmin = currentUser.role.includes("superadmin");

  if (isAdmin || isSuperAdmin) {
    if (req.body.teacherId) {
      return await User.findById(req.body.teacherId).select(
        "name email phoneNumber gender birthday about profileImage role",
      );
    }
  }

  return await User.findById(currentUser._id).select(
    "name email phoneNumber gender birthday about profileImage role",
  );
};

const createCourse = async (req, res, next) => {
  const isAdmin = req.user.role.includes("admin");
  const isSuperAdmin = req.user.role.includes("superadmin");

  try {
    const files = req.files || {};

    // const courseImagePath = files.courseImage[0].path;
    // const courseVideoPath = files.courseVideo[0].path;

    // if (!files.courseImage || !files.courseVideo) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "courseImage and courseVideo are required",
    //   });
    // }

    const {
      title,
      description,
      categories: rawCategories,
      courseLevel,
      rating,
      price,
    } = req.body;

    const createdBy = req.user ? req.user._id : undefined;
    const teacher = await resolveTeacher(req);

    if (!rawCategories) {
      return res.status(400).json({
        success: false,
        message: "categories is required",
      });
    }

    let validCategories = [];

    if (rawCategories) {
      const parsed = normalizeCategoriesInput(rawCategories);

      for (const catId of parsed) {
        if (!mongoose.Types.ObjectId.isValid(catId)) continue;

        const found = await Category.findById(catId);
        if (found) validCategories.push(catId);
      }
    }

    if (!courseLevel) {
      return res.status(400).json({
        success: false,
        message: "courseLevel is required",
      });
    }

    let validCourseLevel = null;

    if (courseLevel && mongoose.Types.ObjectId.isValid(courseLevel)) {
      const foundLevel = await CourseLevel.findById(courseLevel);
      if (foundLevel) {
        validCourseLevel = courseLevel;
      }
    }

    const payload = {
      title,
      description,
      categories: validCategories,
      courseLevel: validCourseLevel,
      teacher: teacher._id,
      rating: Number(rating) || 0,
      price: Number(price) || 0,
      courseImage: courseImagePath,
      courseVideo: courseVideoPath,
      createdBy,
    };

    if (!isAdmin && !isSuperAdmin) {
      payload.teacher = req.user._id;
    }

    const course = await courseService.createCourse(payload);
    const full = await courseService.getCourseById(course._id, req.user?.id);

    res.status(201).json({
      success: true,
      data: full,
      meta: {
        skippedCategories:
          rawCategories && validCategories.length === 0
            ? "Some or all categories were invalid and skipped"
            : undefined,
        skippedCourseLevel:
          courseLevel && !validCourseLevel
            ? "Invalid course level was ignored"
            : undefined,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getCourses = async (req, res, next) => {
  const userId = req.user?._id || null;

  try {
    const { categories, courseLevel, search, price, sort, page, limit } =
      req.query;

    const filters = {};

    if (categories) {
      const cats = Array.isArray(categories)
        ? categories
        : categories
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

      for (const c of cats) {
        if (!mongoose.Types.ObjectId.isValid(c)) {
          return res
            .status(400)
            .json({ success: false, message: `Invalid category id: ${c}` });
        }
      }

      filters.categories = { $in: cats };
    }

    if (courseLevel) {
      if (!mongoose.Types.ObjectId.isValid(courseLevel)) {
        return res.status(400).json({
          success: false,
          message: `Invalid courseLevel id: ${courseLevel}`,
        });
      }
      filters.courseLevel = courseLevel;
    }

    if (search && typeof search === "string" && search.trim().length > 0) {
      const safe = escapeRegex(search.trim());
      filters.title = { $regex: safe, $options: "i" };
    }

    if (price === "free") {
      filters.price = 0;
    }

    if (price === "paid") {
      filters.price = { $gt: 0 };
    }

    const result = await courseService.getAllCourses(
      filters,
      {
        sort,
        page,
        limit,
      },
      userId,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  const userId = req.user?._id || null;

  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id, userId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const courseData = course.toObject ? course.toObject() : course;

    const result = {
      ...courseData,
      courseImage: makeFullImageUrl(req, course.courseImage),
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

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isAdmin = req.user.role.includes("admin");
    const isSuperAdmin = req.user.role.includes("superadmin");

    if (!isAdmin && !isSuperAdmin) {
      if (course.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own courses",
        });
      }
    }

    await courseService.deleteCourse(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files || {};

    const isAdmin = req.user.role.includes("admin");
    const isSuperAdmin = req.user.role.includes("superadmin");
    const isPrivileged = isAdmin || isSuperAdmin;

    const existingCourse = await Course.findById(id).select("teacher");

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!isPrivileged) {
      if (existingCourse.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own courses",
        });
      }
    }

    let updateData = { ...req.body };

    if (files.courseImage) updateData.courseImage = files.courseImage[0].path;
    if (files.courseVideo) updateData.courseVideo = files.courseVideo[0].path;

    if (isPrivileged && req.body.teacherId) {
      const teacher = await User.findById(req.body.teacherId).select(
        "name role",
      );

      if (!teacher || !teacher.role.includes("teacher")) {
        return res.status(400).json({
          success: false,
          message: "Invalid teacherId",
        });
      }

      updateData.teacher = teacher._id;
    }

    const updatedCourse = await courseService.updateCourse(id, updateData);

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (err) {
    next(err);
  }
};

const getRelatedCourses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || null;

    const limit = Math.min(Number(req.query.limit) || 6, 20);

    const courses = await courseService.getRelatedCourses(id, userId, limit);

    res.status(200).json({
      success: true,
      data: courses,
    });
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
  getRelatedCourses,
};
