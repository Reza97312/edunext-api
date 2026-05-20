const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },

    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        answer: String,
      },
    ],

    score: Number,

    isPassed: Boolean,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Attempt", attemptSchema);
