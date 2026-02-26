const wishlistService = require("./wishlistService");

class WishlistController {
  async add(req, res, next) {
    try {
      const result = await wishlistService.addToWishlist(
        req.user.id,
        req.body.courseId,
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const result = await wishlistService.removeFromWishlist(
        req.user.id,
        req.params.courseId,
      );

      res.json({
        message: "Removed successfully",
        deleted: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async myWishlist(req, res, next) {
    try {
      const result = await wishlistService.getMyWishlist(
        req.user.id,
        req.query,
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WishlistController();
