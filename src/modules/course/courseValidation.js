const Joi = require("joi");

const createSchema = Joi.object({
  title: Joi.string().min(1).required().messages({
    "string.empty": "Title is required",
  }),
  category: Joi.string().min(1).required().messages({
    "string.empty": "Category is required",
  }),
  teacherName: Joi.string().min(1).required().messages({
    "string.empty": "Teacher name is required",
  }),
  rating: Joi.number().min(0).max(5).optional(),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
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
  validateCreateCourse: validate(createSchema),
};
