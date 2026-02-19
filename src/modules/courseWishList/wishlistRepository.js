const Wishlist = require("./wishlistModel");

class WishlistRepository {
  async add(data) {
    return await Wishlist.create(data);
  }

  async remove(userId, courseId) {
    return await Wishlist.findOneAndDelete({
      user: userId,
      course: courseId,
    });
  }

  async findUserWishlist(userId, filter, options) {
    return await Wishlist.find({ user: userId, ...filter })
      .populate("course")
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  async countUserWishlist(userId, filter) {
    return await Wishlist.countDocuments({ user: userId, ...filter });
  }

  async exists(userId, courseId) {
    return await Wishlist.findOne({
      user: userId,
      course: courseId,
    });
  }
}

module.exports = new WishlistRepository();
