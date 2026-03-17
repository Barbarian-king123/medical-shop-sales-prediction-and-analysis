const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Delete existing users
  await knex("users").del();

  const hashedPassword = await bcrypt.hash("owner123", 10);

  await knex("users").insert([
    {
      username: "owner",
      password_hash: hashedPassword,
      role: "Owner",
    },
  ]);
};