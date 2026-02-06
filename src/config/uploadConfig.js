const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = "edunext/others";
    let resourceType = "auto";

    if (file.fieldname === "profileImage") {
      folderName = "edunext/users";
      resourceType = "image";
    } else if (
      file.fieldname === "courseImage" ||
      file.fieldname === "teacherImage"
    ) {
      folderName = "edunext/images";
      resourceType = "image";
    } else if (file.fieldname === "courseVideo") {
      folderName = "edunext/videos";
      resourceType = "video";
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
