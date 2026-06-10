const Joi = require("joi");

const questionItemSchema = Joi.object({
  text: Joi.string().min(1).required().messages({
    "string.empty": "Question text is required",
  }),
  options: Joi.array().items(Joi.string().min(1)).min(2).required().messages({
    "array.min": "Each question must have at least 2 options",
    "any.required": "Options are required",
  }),
  correctAnswer: Joi.string().min(1).required().messages({
    "string.empty": "Correct answer is required",
  }),
});

const createBulkSchema = Joi.object({
  examId: Joi.string().required().messages({
    "any.required": "examId is required",
    "string.empty": "examId cannot be empty",
  }),
  questions: Joi.array().items(questionItemSchema).min(1).required().messages({
    "array.min": "Questions array must contain at least one question",
    "any.required": "Questions are required",
  }),
});

const validateCreateQuestionsBulk = (req, res, next) => {
  const { error } = createBulkSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((e) => e.message),
    });
  }

  next();
};

module.exports = {
  validateCreateQuestionsBulk,
};
