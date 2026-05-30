const AdminPanel = require("../modules/adminPanel/adminPanelModel");

const checkMaintenanceMode = async (req, res, next) => {
  try {
    if (
      req.path.startsWith("/api/admin-panel") ||
      req.path.startsWith("/api/auth") ||
      req.path.startsWith("/api-docs")
    ) {
      return next();
    }

    const settings = await AdminPanel.findOne();

    if (settings && settings.isMaintenanceMode) {
      return res.status(503).json({
        success: false,
        message:
          "The system is currently undergoing maintenance. Please try again later.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkMaintenanceMode;
