const Joi = require("joi");
const mongoose = require("mongoose");

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

exports.addToWishlistSchema = Joi.object({
  courseId: Joi.string().custom(objectIdValidator).required(),
});

exports.wishlistIdParamSchema = Joi.object({
  wishlistId: Joi.string().custom(objectIdValidator).required(),
});
