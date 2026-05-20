const Joi = require("joi");

const createSchema = Joi.object({
  course: Joi.string().required(),
  title: Joi.string().required(),
  passingScore: Joi.number().min(0).max(100),
  timeLimit: Joi.number().min(0),
});

const updateSchema = Joi.object({
  title: Joi.string(),
  passingScore: Joi.number().min(0).max(100),
  timeLimit: Joi.number().min(0),
}).min(1);

module.exports = {
  validateCreateExam: (req, res, next) => {
    const { error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  },

  validateUpdateExam: (req, res, next) => {
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  },
};
