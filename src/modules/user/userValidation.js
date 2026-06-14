const Joi = require("joi");
const { deleteFromCloudinary } = require("../../utils/cloudinaryUtils");

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

const removeEmptyStrings = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === "") {
      delete obj[key];
    }
  });
};

const validateCreate = (schema) => async (req, res, next) => {
  removeEmptyStrings(req.body);

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    if (req.file?.filename) {
      await deleteFromCloudinary(req.file.filename);
    }

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

const validateUpdate = (schema) => async (req, res, next) => {
  removeEmptyStrings(req.body);

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    if (req.file?.filename) {
      await deleteFromCloudinary(req.file.filename);
    }

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  if (Object.keys(req.body).length === 0 && !req.file) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required",
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
});

module.exports = {
  validateAddRole: validateCreate(roleSchema),
  validateRemoveRole: validateCreate(roleSchema),
  validateCreateUser: validateCreate(createUserSchema),
  validateUpdateUser: validateUpdate(updateUserSchema),
};
