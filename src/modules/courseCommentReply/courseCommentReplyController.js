const replyRepository = require("./replyRepository");
const mongoose = require("mongoose");
const Comment = require("../courseComment/commentModel");

const makeFullImageUrl = (req, imgPath) => {
  if (!imgPath) return imgPath;
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  return baseUrl + cleanPath;
};

const createReply = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid comment id" });
    }

    const foundComment = await Comment.findById(commentId);
    if (!foundComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    const reply = await replyRepository.create({
      comment: commentId,
      user: req.user._id,
      content,
    });

    const populated = await reply.populate("user", "name avatar");

    const user = populated.user || {};
    const avatarFull = makeFullImageUrl(req, user.profileImage);

    const result = {
      _id: populated._id,
      comment: populated.comment,
      content: populated.content,
      createdAt: populated.createdAt,
      user: {
        _id: user._id,
        name: user.name,
        profileImage: avatarFull,
      },
    };

    res
      .status(201)
      .json({ success: true, message: "Reply created", data: result });
  } catch (err) {
    next(err);
  }
};

const getRepliesByCommentId = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid comment id" });
    }

    const foundComment = await Comment.findById(commentId);
    if (!foundComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    const replies = await replyRepository.getByCommentId(commentId);

    const mapped = replies.map((r) => {
      const user = r.user || {};
      return {
        _id: r._id,
        content: r.content,
        createdAt: r.createdAt,
        user: {
          _id: user._id,
          name: user.name,
          profileImage: makeFullImageUrl(req, user.profileImage),
        },
      };
    });

    res.status(200).json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReply,
  getRepliesByCommentId,
};
