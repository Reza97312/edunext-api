const Wishlist = require("./wishlistModel");
const mongoose = require("mongoose");

class WishlistRepository {
  async findUserWishlist(userId, { page, limit, search, sort }) {
    const skip = (page - 1) * limit;

    const matchStage = {
      user: new mongoose.Types.ObjectId(userId),
    };

    const sortStage =
      sort === "highest"
        ? { "course.price": -1 }
        : sort === "lowest"
          ? { "course.price": 1 }
          : {};

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },

      { $unwind: "$course" },
    ];

    if (search) {
      pipeline.push({
        $match: {
          "course.title": {
            $regex: search,
            $options: "i",
          },
        },
      });
    }

    if (Object.keys(sortStage).length) {
      pipeline.push({ $sort: sortStage });
    }

    pipeline.push({ $skip: skip }, { $limit: limit });

    return await Wishlist.aggregate(pipeline);
  }

  async countUserWishlist(userId, search) {
    const pipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
    ];

    if (search) {
      pipeline.push({
        $match: {
          "course.title": {
            $regex: search,
            $options: "i",
          },
        },
      });
    }

    pipeline.push({ $count: "total" });

    const result = await Wishlist.aggregate(pipeline);

    return result[0]?.total || 0;
  }

  async removeById(id, userId) {
    return await Wishlist.findOneAndDelete({
      _id: id,
      user: userId,
    });
  }
}

module.exports = new WishlistRepository();
