require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/modules/user/userModel");

const migrate = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);

    const result = await User.updateMany(
      { name: { $exists: false } },
      { $set: { name: "Unknown" } },
    );

    console.log("Migration done:", result.modifiedCount, "users updated");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

migrate();
////////////ddddddddddddddddddddddddddddd/////////////////
