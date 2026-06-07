const Comment = require("./commentModel");
const User = require("../user/userModel");

const create = async (data) => await Comment.create(data);

const getByCourseId = async (courseId, onlyConfirmed = true) => {
  const filter = { course: courseId };
  if (onlyConfirmed) filter.isConfirmed = true;
  return await Comment.find(filter).populate("user", "name profileImage");
};

const updateStatus = async (commentId, status) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    { isConfirmed: status },
    { new: true },
  );
};

const getAdminComments = async ({
  courseId,
  isConfirmed,
  page = 1,
  limit = 10,
  search,
} = {}) => {
  const filter = {};

  if (courseId) filter.course = courseId;

  if (typeof isConfirmed === "boolean") {
    filter.isConfirmed = isConfirmed;
  }

  if (search && search.trim()) {
    const matchedUsers = await User.find({
      name: { $regex: search.trim(), $options: "i" },
    }).select("_id");

    const userIds = matchedUsers.map((u) => u._id);

    if (userIds.length === 0) {
      return {
        comments: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    filter.user = { $in: userIds };
  }

  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .populate("user", "name profileImage")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments(filter),
  ]);

  return {
    comments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const deleteById = async (commentId) => {
  return await Comment.findByIdAndDelete(commentId);
};

module.exports = {
  create,
  getByCourseId,
  updateStatus,
  getAdminComments,
  deleteById,
};
