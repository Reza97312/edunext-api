const authService = require("./authService");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.register(name, email, password);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      res.status(401);
    }
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const token = await authService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message: "Reset token generated",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

const adminOnly = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Admin access granted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  adminOnly,
  profile,
};
