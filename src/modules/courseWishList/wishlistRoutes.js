const express = require("express");
const router = express.Router();
const wishlistController = require("./wishlistController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.post("/", authMiddleware, wishlistController.add);

router.delete("/:courseId", authMiddleware, wishlistController.remove);

router.get("/my-courses", authMiddleware, wishlistController.myWishlist);

module.exports = router;
