const User = require("./userModel");

const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

const findUserByEmail = async (email, selectPassword = false) => {
  let query = User.findOne({ email });
  if (selectPassword) {
    query = query.select("+password");
  }

  return await query;
};

const findUserById = async (id) => {
  return await User.findById(id);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
