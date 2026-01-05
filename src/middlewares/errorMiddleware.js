const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.stack || err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.errors,
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = errorHandler;
