const bcrypt = require("bcryptjs");
const repo = require("./profile.repository");
const AppError = require("../../utils/AppError");


// =========================
// Get Profile
// =========================

exports.getProfile = async (userId) => {

  const user = await repo.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    username: user.username,
    role: user.role,
    is_active: user.is_active
  };

};


// =========================
// Change Password
// =========================

exports.changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {

  const user = await repo.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.is_active) {
    throw new AppError("Inactive users cannot update password", 403);
  }

  const match = await bcrypt.compare(
    currentPassword,
    user.password_hash
  );

  if (!match) {
    throw new AppError("Current password incorrect", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await repo.updatePassword(userId, hashed);

};


// =========================
// Change Username (Owner)
// =========================

exports.changeUsername = async (
  userId,
  newUsername
) => {

  if (!newUsername) {
    throw new AppError("Username required", 400);
  }

  if (newUsername.length < 3) {
    throw new AppError("Username too short", 400);
  }

  const existingUser =
    await repo.getUserByUsername(newUsername);

  if (existingUser) {
    throw new AppError("Username already exists", 400);
  }

  await repo.updateUsername(userId, newUsername);

};