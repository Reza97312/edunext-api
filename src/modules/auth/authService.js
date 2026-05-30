const authRepository = require("./authRepository");
const crypto = require("crypto");
const User = require("../user/userModel");

const { hashPassword, comparePassword } = require("../../utils/hashUtil");
const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/tokenUtil");

const register = async (name, email, password) => {
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await authRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role: ["user"],
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
};

const login = async (email, password) => {
  const user = await authRepository.findUserByEmail(email, true);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  };
};

const forgotPassword = async (email) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("User with this email does not exist");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  console.log(`Raw Reset Token for ${email}: ${resetToken}`);
  return resetToken;
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Token is invalid or has expired");
  }
  user.password = await hashPassword(newPassword);

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  return true;
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token is required");

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await authRepository.findUserById(decoded.id);
    if (!user) throw new Error("User not found");

    const newAccessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
