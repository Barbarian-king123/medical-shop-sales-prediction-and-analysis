const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");
const repo = require("./auth.repository");

exports.register = async ({ username, password, role }) => {
  if (!username || !password) {
    throw new AppError("Username and password required", 400);
  }

  const allowedRoles = ["Owner", "Pharmacist", "Staff"];

  // 👉 Set default role if not provided
  const finalRole = role || "Owner";

  // 👉 Validate role
  if (!allowedRoles.includes(finalRole)) {
    throw new AppError("Invalid role selected", 400);
  }

  const existingUser = await repo.findUserByUsername(username);

  if (existingUser) {
    throw new AppError("Username already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await repo.createUser({
    username,
    password_hash: hashedPassword,
    role: finalRole, // 👉 use finalRole instead of role
  });

  return {
    message: "User registered",
    user,
  };
};

exports.login = async ({ username, password, role }) => {
  if (!username || !password || !role) {
    throw new AppError("Username, password and role required", 400);
  }

  const user = await repo.findUserByUsername(username);

  if (!user || user.role !== role) {
    throw new AppError("Invalid credentials", 401);
  }

  // NEW CHECK
  if (!user.is_active) {
    throw new AppError("Account is deactivated. Contact owner.", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    message: "Login successful",
    token,
  };
};