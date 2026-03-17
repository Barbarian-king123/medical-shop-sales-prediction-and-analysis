const db = require("../../config/db");

exports.getUsers = async () => {

  return db("users")
    .select(
      "user_id",
      "username",
      "role",
      "is_active",
      "created_at"
    )
    .orderBy("user_id");

};

exports.getUserById = async (id) => {

  return db("users")
    .where({ user_id: id })
    .first();

};

exports.getUserByUsername = async (username) => {

  return db("users")
    .where({ username })
    .first();

};

exports.createUser = async (data) => {

  const [user] = await db("users")
    .insert(data)
    .returning("*");

  return user;

};

exports.updateUsername = async (id, username) => {

  return db("users")
    .where({ user_id: id })
    .update({ username });

};

exports.updatePassword = async (id, password_hash) => {

  return db("users")
    .where({ user_id: id })
    .update({ password_hash });

};

exports.updateRole = async (id, role) => {

  return db("users")
    .where({ user_id: id })
    .update({ role });

};

exports.updateStatus = async (id, status) => {

  return db("users")
    .where({ user_id: id })
    .update({ is_active: status });

};