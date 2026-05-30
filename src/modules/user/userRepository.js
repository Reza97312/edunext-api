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

const saveUser = async (user) => {
  return await user.save();
};

const findAllUsers = async (filters = {}) => {
  const { search, role } = filters;

  const query = {};

  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (role === "teacher" || role === "admin") {
    query.role = role;
  }

  return await User.find(query).select("-password").sort({ createdAt: -1 });
};

const updateUserById = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  saveUser,
  updateUserById,
  deleteUserById,
};
