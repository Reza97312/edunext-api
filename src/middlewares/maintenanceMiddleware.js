// const AdminPanel = require("../modules/adminPanel/adminPanelModel");

// const checkMaintenanceMode = async (req, res, next) => {
//   try {
//     if (
//       req.path.startsWith("/api/admin-panel") ||
//       req.path.startsWith("/api/auth") ||
//       req.path.startsWith("/api-docs")
//     ) {
//       return next();
//     }

//     const settings = await AdminPanel.findOne();

//     if (settings && settings.isMaintenanceMode) {
//       return res.status(503).json({
//         success: false,
//         message:
//           "The system is currently undergoing maintenance. Please try again later.",
//       });
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = checkMaintenanceMode;
const AdminPanel = require("../modules/adminPanel/adminPanelModel");
const { verifyAccessToken } = require("../utils/tokenUtil");
const User = require("../modules/user/userModel");

const checkMaintenanceMode = async (req, res, next) => {
  try {
    if (
      req.path.startsWith("/api/admin-panel") ||
      req.path.startsWith("/api/auth") ||
      req.path.startsWith("/api-docs") ||
      req.path.startsWith("/uploads")
    ) {
      return next();
    }

    const settings = await AdminPanel.findOne();

    if (!settings || !settings.isMaintenanceMode) {
      return next();
    }

    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id).select("role");

        if (
          user &&
          user.role &&
          (user.role.includes("admin") || user.role.includes("superadmin"))
        ) {
          return next();
        }
      } catch (error) {
        console.log("Maintenance Auth Bypass Error:", error.message);
      }
    }

    return res.status(503).json({
      success: false,
      message:
        "The system is currently undergoing maintenance. Please try again later.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = checkMaintenanceMode;
