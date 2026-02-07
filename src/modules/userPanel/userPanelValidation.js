const Joi = require("joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50),

  email: Joi.string().email(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Phone number must be between 10 and 15 digits",
    }),

  gender: Joi.string().valid("male", "female", "other"),

  birthday: Joi.date().allow(null),

  about: Joi.string().max(500).allow("", null),
}).min(1);

const updateProfileValidator = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  updateProfileValidator,
};
