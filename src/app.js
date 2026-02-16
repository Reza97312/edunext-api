const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorMiddleware");
const { globalLimiter } = require("./middlewares/rateLimitMiddleware");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");
const authRoutes = require("./modules/auth/authRoutes");
const path = require("path");
const courseRoutes = require("./modules/course/courseRoutes");
const commentRoutes = require("./modules/courseComment/commentRoutes");
const userPanelRoutes = require("./modules/userPanel/userPanelRoutes");
const categoryRoutes = require("./modules/category/categoryRoutes");
const courseLevelRoutes = require("./modules/courseLevel/courseLevelRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(require("cors")({ origin: true, credentials: true }));
app.options("*", require("cors")({ origin: true, credentials: true }));

// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   }),
// );

app.use(globalLimiter);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/courses", courseRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user-panel", userPanelRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/course-levels", courseLevelRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "AuthX API is running" });
});

app.use(errorHandler);

module.exports = app;
