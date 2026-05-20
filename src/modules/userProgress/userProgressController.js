const User = require("../user/userModel");

const updateProgress = async (req, res, next) => {
  try {
    const { courseId, watchedSeconds, totalSeconds } = req.body;

    if (!courseId || watchedSeconds == null || totalSeconds == null) {
      return res.status(400).json({
        success: false,
        message: "courseId, watchedSeconds, totalSeconds are required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let progress = user.courseProgress.find(
      (p) => p.course?.toString() === courseId,
    );

    if (!progress) {
      user.courseProgress.push({
        course: courseId,
        watchedSeconds: Math.min(watchedSeconds, totalSeconds),
        totalSeconds,
        isCompleted: watchedSeconds >= totalSeconds * 0.95,
      });
    } else {
      const previous = progress.watchedSeconds || 0;
      const diff = watchedSeconds - previous;

      if (diff <= 60) {
        progress.watchedSeconds = Math.max(previous, watchedSeconds);
      }

      if (progress.watchedSeconds > totalSeconds) {
        progress.watchedSeconds = totalSeconds;
      }

      progress.totalSeconds = totalSeconds;

      if (progress.watchedSeconds >= totalSeconds * 0.95) {
        progress.isCompleted = true;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Progress updated",
    });
  } catch (err) {
    next(err);
  }
};

const getProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const user = await User.findById(req.user._id).select("courseProgress");

    const progress = user?.courseProgress?.find(
      (p) => p.course?.toString() === courseId,
    );

    res.json({
      success: true,
      data: progress || null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateProgress,
  getProgress,
};
