const Reply = require("./replyModel");

const create = async (data) => {
  return await Reply.create(data);
};

const getByCommentId = async (commentId) => {
  return await Reply.find({ comment: commentId })
    .sort({ createdAt: 1 })
    .populate("user", "name profileImage");
};

module.exports = {
  create,
  getByCommentId,
};
