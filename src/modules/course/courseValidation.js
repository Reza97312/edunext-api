const Joi = require("joi");

const createSchema = Joi.object({
  title: Joi.string().min(1).required().messages({
    "string.empty": "Title is required",
  }),
  categories: Joi.alternatives()
    .try(Joi.array().items(Joi.string().required()).min(1), Joi.string().min(1))
    .required()
    .messages({
      "any.required": "At least one category is required",
    }),
  courseLevel: Joi.string().min(1).required().messages({
    "string.empty": "Course level is required",
  }),
  teacherName: Joi.string().min(1).required().messages({
    "string.empty": "Teacher name is required",
  }),
  rating: Joi.number().min(0).max(5).optional(),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
  }),
  description: Joi.string().min(10).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
  }),
});

const updateSchema = Joi.object({
  title: Joi.string().min(1).optional(),
  category: Joi.string().min(1).optional(),
  teacherName: Joi.string().min(1).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  price: Joi.number().min(0).optional(),
  description: Joi.string().min(10).optional(),
}).min(1);

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
  validateUpdateCourse: validate(updateSchema),
};
