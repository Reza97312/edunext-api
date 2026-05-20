const User = require("../user/userModel");
const Certificate = require("../certificate/certificateModel");
const Attempt = require("../attempt/attemptModel");
const Course = require("../course/courseModel");

const getUserCoursesWithStatus = async (userId) => {
  const user = await User.findById(userId).populate("purchasedCourses").lean();

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

    return {
      course,
      examStatus: attempt
        ? {
            taken: true,
            score: attempt.score,
            isPassed: attempt.isPassed,
          }
        : { taken: false },

      certificate: certificate
        ? {
            issued: true,
            code: certificate.code,
          }
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

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  removeUserAvatar,
  getUserCoursesWithStatus,
  getUserCertificates,
};
