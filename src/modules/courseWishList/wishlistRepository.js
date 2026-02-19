const Wishlist = require("./wishlistModel");

class WishlistRepository {
  async add(data) {
    return await Wishlist.create(data);
  }

  async findById(id) {
    return await Wishlist.findById(id);
  }

  async removeById(id, userId) {
    return await Wishlist.findOneAndDelete({
      _id: id,
      user: userId,
    });
  }

  async findUserWishlist(userId, options) {
    return await Wishlist.find({ user: userId })
      .populate("course")
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  async countUserWishlist(userId) {
    return await Wishlist.countDocuments({ user: userId });
  }

  async exists(userId, courseId) {
    return await Wishlist.findOne({
      user: userId,
      course: courseId,
    });
  }
}

module.exports = new WishlistRepository();
