const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseVideo: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    courseLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseLevel",
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
      trim: true,
    },
    courseImage: {
      type: String,
      required: true,
    },
    teacherImage: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
