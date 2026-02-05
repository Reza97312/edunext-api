const commentRepository = require("./commentRepository");

const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { courseId } = req.params;

    const comment = await commentRepository.create({
      content,
      course: courseId,
      user: req.user._id,
    });

    res
      .status(201)
      .json({
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

module.exports = { createComment, getCourseComments, confirmComment };
