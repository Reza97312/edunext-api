const Reply = require("./courseCommentReplyModel");

const create = async (data) => {
  return await Reply.create(data);
};

const getByCommentId = async (commentId) => {
  return await Reply.find({ comment: commentId })
    .sort({ createdAt: 1 })
    .populate("user", "name profileImage");
};

const deleteById = async (replyId) => {
  return await Reply.findByIdAndDelete(replyId);
};

const deleteManyByCommentId = async (commentId) => {
  return await Reply.deleteMany({ comment: commentId });
};

const findByIdAndCommentId = async (replyId, commentId) => {
  return await Reply.findOne({ _id: replyId, comment: commentId });
};

module.exports = {
  create,
  getByCommentId,
  deleteById,
  deleteManyByCommentId,
  findByIdAndCommentId,
};
