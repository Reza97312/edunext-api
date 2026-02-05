const Comment = require("./commentModel");

const create = async (data) => await Comment.create(data);

const getByCourseId = async (courseId, onlyConfirmed = true) => {
  const filter = { course: courseId };
  if (onlyConfirmed) filter.isConfirmed = true;
  return await Comment.find(filter).populate("user", "name");
};

const updateStatus = async (commentId, status) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    { isConfirmed: status },
    { new: true },
  );
};

module.exports = { create, getByCourseId, updateStatus };
