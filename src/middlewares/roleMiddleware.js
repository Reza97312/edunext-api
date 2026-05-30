const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !Array.isArray(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const hasRole = req.user.role.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Required role -> ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorize;
