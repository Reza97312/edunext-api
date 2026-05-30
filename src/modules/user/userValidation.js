const Joi = require("joi");

const roleList = ["user", "admin", "moderator", "teacher", "superadmin"];

const roleSchema = Joi.object({
  role: Joi.string()
    .valid(...roleList)
    .required()
    .messages({
      "any.only": "Invalid role type",
      "any.required": "Role is required",
    }),
});

const validate = (schema) => (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

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

const createUserSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  phoneNumber: Joi.string().allow(null, ""),
  gender: Joi.string().valid("male", "female", "other").allow(null),
  birthday: Joi.date().iso().allow(null),
  about: Joi.string().max(500).allow(null, ""),
  profileImage: Joi.string().allow(null, ""),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).messages({
    "string.min": "Name must be at least 3 characters",
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().min(6).messages({
    "string.min": "Password must be at least 6 characters",
  }),
  phoneNumber: Joi.string().allow(null, ""),
  gender: Joi.string().valid("male", "female", "other").allow(null),
  birthday: Joi.date().iso().allow(null),
  about: Joi.string().max(500).allow(null, ""),
  profileImage: Joi.string().allow(null, ""),
}).min(1);

module.exports = {
  validateAddRole: validate(roleSchema),
  validateRemoveRole: validate(roleSchema),
  validateCreateUser: validate(createUserSchema),
  validateUpdateUser: validate(updateUserSchema),
};
