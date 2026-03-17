const db = require("../../config/db");

exports.getUserById = async (userId) => {

  return db("users")
    .where({ user_id: userId })
    .first();

};

exports.getUserByUsername = async (username) => {

  return db("users")
    .where({ username })
    .first();

};

exports.updatePassword = async (userId, hashedPassword) => {

  return db("users")
    .where({ user_id: userId })
    .update({
      password_hash: hashedPassword
    });

};

exports.updateUsername = async (userId, newUsername) => {

  return db("users")
    .where({ user_id: userId })
    .update({
      username: newUsername
    });

};