const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,

  validate: { trustProxy: false },
  handler: (req, res) => {
    console.log("IP Blocked:", req.ip);
    res.status(429).json({
      success: false,
      message: "Too many requests! Please wait 1 minute.",
    });
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});

module.exports = { globalLimiter, authLimiter };
