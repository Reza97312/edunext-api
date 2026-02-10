const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    "string.empty": "Level name is required",
  }),
  description: Joi.string().optional().allow(""),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

module.exports = {
  validateCreateCourseLevel: validate(createSchema),
};
