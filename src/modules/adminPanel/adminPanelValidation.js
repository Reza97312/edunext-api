const Joi = require("joi");

const updateSettingsSchema = Joi.object({
  siteTitle: Joi.string().min(3).max(100).messages({
    "string.min": "Site title must be at least 3 characters",
  }),
  isMaintenanceMode: Joi.boolean(),
}).min(1);

const validateUpdateSettings = (req, res, next) => {
  const { error } = updateSettingsSchema.validate(req.body, {
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

module.exports = { validateUpdateSettings };
