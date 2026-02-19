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
    return await wishlistRepository.remove(userId, courseId);
  }

  async getMyWishlist(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.search) {
      filter["course.title"] = {
        $regex: query.search,
        $options: "i",
      };
    }

    let sort = {};
    if (query.sort === "highest") sort = { "course.price": -1 };
    if (query.sort === "lowest") sort = { "course.price": 1 };

    const data = await wishlistRepository.findUserWishlist(
      userId,
      {},
      { sort, skip, limit },
    );

    const total = await wishlistRepository.countUserWishlist(userId, {});

    return {
      total,
      page,
      pages: Math.ceil(total / limit),
      data,
    };
  }
}

module.exports = new WishlistService();
