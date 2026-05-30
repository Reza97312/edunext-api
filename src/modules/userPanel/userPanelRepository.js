const User = require("../user/userModel");
const Certificate = require("../certificate/certificateModel");
const Attempt = require("../attempt/attemptModel");
const Course = require("../course/courseModel");

const getUserCoursesWithStatus = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: "purchasedCourses",
      populate: [
        { path: "teacher", select: "name profileImage" },
        { path: "categories", select: "name" },
        { path: "courseLevel", select: "name" },
      ],
    })
    .lean();

  if (!user) return null;

  const attempts = await Attempt.find({ user: userId }).lean();
  const certificates = await Certificate.find({ user: userId }).lean();

  const data = user.purchasedCourses.map((course) => {
    const attempt = attempts.find(
      (a) => a.exam?.toString() === course._id.toString(),
    );

    const certificate = certificates.find(
      (c) => c.course.toString() === course._id.toString(),
    );

    const progressEntry = user.courseProgress?.find(
      (p) => p.course?.toString() === course._id.toString(),
    );

    const progressPercent =
      progressEntry && progressEntry.totalSeconds > 0
        ? Math.round(
            (progressEntry.watchedSeconds / progressEntry.totalSeconds) * 100,
          )
        : 0;

    const { teacher, teacherImage, ...courseData } = course;

    return {
      course: courseData,
      teacher: teacher
        ? {
            _id: teacher._id,
            name: teacher.name,
            profileImage: teacher.profileImage,
          }
        : null,
      progress: {
        watchedSeconds: progressEntry?.watchedSeconds ?? 0,
        totalSeconds: progressEntry?.totalSeconds ?? 0,
        percent: progressPercent,
        isCompleted: progressEntry?.isCompleted ?? false,
      },
      examStatus: attempt
        ? { taken: true, score: attempt.score, isPassed: attempt.isPassed }
        : { taken: false },
      certificate: certificate
        ? { issued: true, code: certificate.code }
        : { issued: false },
    };
  });

  return data;
};

const getUserCertificates = async (userId) => {
  return await Certificate.find({ user: userId }).populate("course");
};

const getUserProfile = async (userId) => {
  return await User.findById(userId).select(
    "-password -passwordResetToken -passwordResetExpires",
  );
};

const updateUserProfile = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

const updateUserAvatar = async (userId, imageUrl, publicId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      profileImage: imageUrl,
      profileImagePublicId: publicId,
    },
    { new: true },
  ).select("-password");
};

const removeUserAvatar = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $unset: { profileImage: 1, profileImagePublicId: 1 },
    },
    { new: true },
  ).select("-password");
};

const getUserReports = async (userId) => {
  const user = await User.findById(userId)
    .select("purchasedCourses courseProgress")
    .lean();

  if (!user) return null;

  const certificatesCount = await Certificate.countDocuments({
    user: userId,
  });

  const purchasedCoursesCount = user.purchasedCourses?.length || 0;

  const activeCoursesCount =
    user.courseProgress?.filter((p) => !p.isCompleted).length || 0;

  return {
    purchasedCoursesCount,
    activeCoursesCount,
    certificatesCount,
  };
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  removeUserAvatar,
  getUserCoursesWithStatus,
  getUserCertificates,
  getUserReports,
};
