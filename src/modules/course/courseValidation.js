const Joi = require("joi");

const createSchema = Joi.object({
  title: Joi.string().min(1).required().messages({
    "string.empty": "Title is required",
  }),

  categories: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().required()).min(1).required(),
      Joi.string().min(1),
    )
    .required(),

  courseLevel: Joi.string().min(1).required(),
  teacherId: Joi.string().required().messages({
    "string.empty": "Teacher Id is required",
  }),

  rating: Joi.number().min(0).max(5).optional(),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
  }),

  description: Joi.string().min(10).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
  }),

  courseImage: Joi.any().optional(),
  courseVideo: Joi.any().optional(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(1).optional(),

  categories: Joi.alternatives()
    .try(Joi.array().items(Joi.string()).min(1), Joi.string().min(1))
    .optional(),

  courseLevel: Joi.string().min(1).optional(),
  teacherId: Joi.string().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  price: Joi.number().min(0).optional(),
  description: Joi.string().min(10).optional(),

  courseImage: Joi.any().optional(),
  courseVideo: Joi.any().optional(),
}).min(1);

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

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
