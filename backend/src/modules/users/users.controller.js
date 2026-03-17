const asyncHandler = require("../../utils/asyncHandler");
const service = require("./users.service");


exports.getUsers = asyncHandler(async (req, res) => {

  const users = await service.getUsers();

  res.json({
    status: "success",
    data: users
  });

});


exports.createUser = asyncHandler(async (req, res) => {

  const user = await service.createUser(req.body);

  res.status(201).json({
    status: "success",
    data: user
  });

});


exports.updateUsername = asyncHandler(async (req, res) => {

  await service.updateUsername(req.params.id, req.body.username,req.user.user_id);

  res.json({
    status: "success",
    message: "Username updated"
  });

});


exports.resetPassword = asyncHandler(async (req, res) => {

  await service.resetPassword(req.params.id, req.body.password,req.user.user_id);

  res.json({
    status: "success",
    message: "Password reset"
  });

});


exports.updateRole = asyncHandler(async (req, res) => {

  await service.updateRole(req.params.id, req.body.role,req.user.user_id);

  res.json({
    status: "success",
    message: "Role updated"
  });

});


exports.updateStatus = asyncHandler(async (req, res) => {

  await service.updateStatus(req.params.id,req.user.user_id);

  res.json({
    status: "success",
    message: "User status updated"
  });

});