const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },

    birthday: {
      type: Date,
      default: null,
    },

    about: {
      type: String,
      default: null,
      maxlength: 500,
      trim: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    profileImagePublicId: {
      type: String,
      default: null,
    },
    courseProgress: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          index: true,
        },

        watchedSeconds: {
          type: Number,
          default: 0,
        },

        totalSeconds: {
          type: Number,
          default: 0,
        },

        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    purchasedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    role: {
      type: [String],
      enum: ["user", "admin", "moderator", "teacher", "superadmin"],
      default: ["user"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
