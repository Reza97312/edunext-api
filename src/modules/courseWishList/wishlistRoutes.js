const express = require("express");
const router = express.Router();
const wishlistController = require("./wishlistController");
const { protect } = require("../../middlewares/authMiddleware");

router.post("/", protect, wishlistController.add);

router.delete("/:wishlistId", protect, wishlistController.remove);

router.get("/my-courses", protect, wishlistController.myWishlist);

module.exports = router;
