const bcrypt = require("bcryptjs");
const repo = require("./users.repository");
const AppError = require("../../utils/AppError");

exports.getUsers = async () => {

  return repo.getUsers();

};
exports.ensureEditableUser = async (targetUserId, currentUserId) => {

  const user = await repo.getUserById(targetUserId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Prevent editing yourself
  if (targetUserId == currentUserId) {
    throw new AppError("You cannot edit your own account", 403);
  }

  // Prevent editing other owners
  if (user.role === "Owner") {
    throw new AppError("Owner accounts cannot be modified", 403);
  }

  return user;

};

exports.createUser = async (data) => {

  const { username, password, role } = data;

  if (!username || !password || !role) {
    throw new AppError("Username, password and role required", 400);
  }

  const existing = await repo.getUserByUsername(username);

  if (existing) {
    throw new AppError("Username already exists", 400);
  }

  const hash = await bcrypt.hash(password, 10);

  return repo.createUser({
    username,
    password_hash: hash,
    role,
    is_active: true
  });

};


exports.updateUsername = async (id, username, currentUserId) => {

  await exports.ensureEditableUser(id, currentUserId);

  const existing = await repo.getUserByUsername(username);

  if (existing) {
    throw new AppError("Username already exists", 400);
  }

  await repo.updateUsername(id, username);

};

exports.resetPassword = async (id, password, currentUserId) => {

  await exports.ensureEditableUser(id, currentUserId);

  if (!password || password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const hash = await bcrypt.hash(password, 10);

  await repo.updatePassword(id, hash);

};


exports.updateRole = async (id, role, currentUserId) => {

  await exports.ensureEditableUser(id, currentUserId);

  const allowed = ["Staff","Pharmacist"];

  if (!allowed.includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  await repo.updateRole(id, role);

};


exports.updateStatus = async (id, currentUserId) => {

  const user = await exports.ensureEditableUser(id, currentUserId);

  const newStatus = !user.is_active;

  await repo.updateStatus(id, newStatus);

};