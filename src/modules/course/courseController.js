const courseService = require("./courseService");
const mongoose = require("mongoose");
const Category = require("../category/categoryModel");
const CourseLevel = require("../courseLevel/courseLevelModel");

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
    console.log(req.files);
    const {
      title,
      description,
      categories: rawCategories,
      courseLevel,
      teacherName,
      rating,
      price,
    } = req.body;
    const createdBy = req.user ? req.user._id : undefined;

    const categories = normalizeCategoriesInput(rawCategories);

    if (!categories || categories.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one category is required" });
    }

    for (const catId of categories) {
      if (!mongoose.Types.ObjectId.isValid(catId)) {
        return res
          .status(400)
          .json({ success: false, message: `Invalid category id: ${catId}` });
      }
      const found = await Category.findById(catId);
      if (!found) {
        return res
          .status(400)
          .json({ success: false, message: `Category not found: ${catId}` });
      }
    }

    if (!courseLevel) {
      return res
        .status(400)
        .json({ success: false, message: "Course level is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(courseLevel)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course level id" });
    }
    const foundLevel = await CourseLevel.findById(courseLevel);
    if (!foundLevel) {
      return res
        .status(400)
        .json({ success: false, message: "Course level not found" });
    }

    const payload = {
      title,
      description,
      categories,
      courseLevel,
      teacherName,
      rating: Number(rating) || 0,
      price: Number(price) || 0,
      courseImage: courseImagePath,
      teacherImage: teacherImagePath,
      courseVideo: courseVideoPath,
      createdBy,
    };

    const course = await courseService.createCourse(payload);
    const full = await courseService.getCourseById(course._id);
    res.status(201).json({ success: true, data: full });
  } catch (err) {
    next(err);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const { categories, courseLevel, search, price, sort, page, limit, match } =
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

    const result = await courseService.getAllCourses(filters, {
      sort,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
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
