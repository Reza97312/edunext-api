const userService = require("./userService");

const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const users = await userService.getAllUsers({
      search,
      role,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      meta: users.meta,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const createdUser = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedUser = await userService.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const addRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || typeof role !== "string") {
      return res.status(400).json({
        success: false,
        message: "Role must be a string",
      });
    }

    const updatedUser = await userService.addRoleToUser(id, role, req.user);

    res.status(200).json({
      success: true,
      message: "Role added successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || typeof role !== "string") {
      return res.status(400).json({
        success: false,
        message: "Role must be a string",
      });
    }

    const updatedUser = await userService.removeRoleFromUser(
      id,
      role,
      req.user,
    );

    res.status(200).json({
      success: true,
      message: "Role removed successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addRole,
  removeRole,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
