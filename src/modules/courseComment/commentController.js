const commentRepository = require("./commentRepository");
const replyRepository = require("../courseCommentReply/courseCommentReplyRepository");

const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { courseId } = req.params;

    const comment = await commentRepository.create({
      content,
      course: courseId,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Comment sent for review",
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

const getCourseComments = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const comments = await commentRepository.getByCourseId(courseId);
    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

const confirmComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body;

    const updated = await commentRepository.updateStatus(commentId, status);
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    res
      .status(200)
      .json({ success: true, message: `Comment status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

const getAdminComments = async (req, res, next) => {
  try {
    const { status, courseId, page = 1, limit = 10, search } = req.query;

    const isConfirmed =
      status === "confirmed" ? true : status === "pending" ? false : undefined;

    const result = await commentRepository.getAdminComments({
      courseId,
      isConfirmed,
      page: Number(page),
      limit: Number(limit),
      search,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const deletedComment = await commentRepository.deleteById(commentId);

    if (!deletedComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    await replyRepository.deleteManyByCommentId(commentId);

    res.status(200).json({
      success: true,
      message: "Comment and its replies deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComment,
  getCourseComments,
  confirmComment,
  getAdminComments,
  deleteComment,
};
