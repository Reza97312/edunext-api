const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorMiddleware");
const { globalLimiter } = require("./middlewares/rateLimitMiddleware");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");

const authRoutes = require("./modules/auth/authRoutes");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(globalLimiter);
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "AuthX API is running" });
});

app.use(errorHandler);

module.exports = app;
