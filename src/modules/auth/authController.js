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

    const { accessToken, refreshToken, user } = result;

    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect",
      });
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
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Please login firstttttttttt" });
    }

    const result = await authService.refreshAccessToken(token);
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
