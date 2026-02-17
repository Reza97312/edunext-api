const Joi = require("joi");

const createSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 1 character",
  }),
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
  validateCreateReply: validate(createSchema),
};
