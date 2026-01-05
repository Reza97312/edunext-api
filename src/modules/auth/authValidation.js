const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  next();
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateForgotPassword: validate(forgotPasswordSchema),
  validateResetPassword: validate(resetPasswordSchema),
};
