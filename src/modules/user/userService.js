const userRepository = require("./userRepository");
const bcrypt = require("bcrypt");

const buildError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getAllUsers = async (filters) => {
  return await userRepository.findAllUsers(filters);
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);

  if (!user) {
    throw buildError("User not found", 404);
  }

  return user;
};

const createUser = async (userData) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);

  if (existingUser) {
    throw buildError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const createdUser = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  return await userRepository.findUserById(createdUser._id);
};

const updateUser = async (id, updateData) => {
  const user = await userRepository.findUserById(id);

  if (!user) {
    throw buildError("User not found", 404);
  }

  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await userRepository.findUserByEmail(updateData.email);

    if (existingUser) {
      throw buildError("Email already exists", 409);
    }
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const updatedUser = await userRepository.updateUserById(id, updateData);
  return updatedUser;
};

const deleteUser = async (id) => {
  const deletedUser = await userRepository.deleteUserById(id);

  if (!deletedUser) {
    throw buildError("User not found", 404);
  }

  return deletedUser;
};

const addRoleToUser = async (targetId, role, actorUser) => {
  const user = await userRepository.findUserById(targetId);

  if (!user) throw new Error("User not found");

  if (!Array.isArray(user.role)) {
    user.role = typeof user.role === "string" ? [user.role] : ["user"];
  }

  const actorRoles = actorUser.role;

  if (actorRoles.includes("superadmin")) {
    if (user.role.includes(role)) {
      throw new Error("Role already exists");
    }

    user.role.push(role);
    return userRepository.saveUser(user);
  }

  if (actorRoles.includes("admin")) {
    if (role === "admin" || role === "superadmin") {
      throw new Error("Admin cannot assign admin or superadmin roles");
    }

    if (user.role.includes(role)) {
      throw new Error("Role already exists");
    }

    user.role.push(role);
    return userRepository.saveUser(user);
  }

  throw new Error("Not allowed");
};

const removeRoleFromUser = async (targetId, role, actorUser) => {
  const user = await userRepository.findUserById(targetId);

  if (!user) throw new Error("User not found");

  if (!Array.isArray(user.role)) {
    user.role = typeof user.role === "string" ? [user.role] : ["user"];
  }

  const actorRoles = actorUser.role;

  if (actorRoles.includes("superadmin")) {
    if (actorUser._id.toString() === targetId && role === "superadmin") {
      throw new Error("You cannot remove superadmin role from yourself");
    }

    if (!user.role.includes(role)) {
      throw new Error("Role does not exist");
    }

    user.role = user.role.filter((r) => r !== role);
    return userRepository.saveUser(user);
  }

  if (actorRoles.includes("admin")) {
    if (role === "admin" || role === "superadmin") {
      throw new Error("Admin cannot remove admin or superadmin roles");
    }

    if (!user.role.includes(role)) {
      throw new Error("Role does not exist");
    }

    user.role = user.role.filter((r) => r !== role);
    return userRepository.saveUser(user);
  }

  throw new Error("Not allowed");
};

module.exports = {
  addRoleToUser,
  removeRoleFromUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
