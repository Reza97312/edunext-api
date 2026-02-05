const express = require("express");
const router = express.Router();
const commentController = require("./commentController");
const protect = require("../../middlewares/authMiddleware");
const authorize = require("../../middlewares/roleMiddleware");

router.post("/:courseId", protect, commentController.createComment);

router.get("/:courseId", commentController.getCourseComments);

router.patch(
  "/:commentId/confirm",
  protect,
  authorize("admin", "moderator"),
  commentController.confirmComment,
);

module.exports = router;
