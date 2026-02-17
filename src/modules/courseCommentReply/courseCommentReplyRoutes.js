const express = require("express");
const router = express.Router();
const replyController = require("./replyController");
const { protect } = require("../../middlewares/authMiddleware");
const { validateCreateReply } = require("./replyValidation");

router.post(
  "/:commentId",
  protect,
  validateCreateReply,
  replyController.createReply,
);

router.get("/:commentId", replyController.getRepliesByCommentId);

module.exports = router;
