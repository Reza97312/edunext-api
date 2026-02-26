const wishlistRepository = require("./wishlistRepository");

class WishlistService {
  async addToWishlist(userId, courseId) {
    const exists = await wishlistRepository.exists(userId, courseId);
    if (exists) throw new Error("Course already in wishlist");

    return await wishlistRepository.add({
      user: userId,
      course: courseId,
    });
  }

  async removeFromWishlist(userId, courseId) {
    const deleted = await wishlistRepository.removeByCourse(userId, courseId);

    if (!deleted) {
      throw new Error("Wishlist item not found");
    }

    return deleted;
  }

  async getMyWishlist(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const search = query.search || "";
    const sort = query.sort || "";

    const data = await wishlistRepository.findUserWishlist(userId, {
      page,
      limit,
      search,
      sort,
    });

    const total = await wishlistRepository.countUserWishlist(userId, search);

    return {
      total,
      page,
      pages: Math.ceil(total / limit),
      data,
    };
  }
}

module.exports = new WishlistService();
