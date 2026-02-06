const { cloudinary } = require("../config/uploadConfig");

const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { deleteFromCloudinary };
