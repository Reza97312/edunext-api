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
const replyRoutes = require("./modules/courseCommentReply/courseCommentReplyRoutes");
const wishlistRoutes = require("./modules/courseWishList/wishlistRoutes");
const paymentRoutes = require("./modules/payment/paymentRoutes");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.1.105:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(globalLimiter);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/courses", courseRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user-panel", userPanelRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/course-levels", courseLevelRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "AuthX API is running" });
});

app.use(errorHandler);

module.exports = app;
