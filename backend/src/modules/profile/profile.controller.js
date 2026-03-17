const asyncHandler = require("../../utils/asyncHandler");
const service = require("./profile.service");


// =========================
// Get Profile
// =========================

exports.getProfile = asyncHandler(async (req, res) => {

  const profile = await service.getProfile(
    req.user.user_id
  );

  res.status(200).json({
    status: "success",
    data: profile
  });

});


// =========================
// Change Password
// =========================

exports.changePassword = asyncHandler(async (req, res) => {

  await service.changePassword(
    req.user.user_id,
    req.body.current_password,
    req.body.new_password
  );

  res.status(200).json({
    status: "success",
    message: "Password updated successfully"
  });

});


// =========================
// Change Username
// =========================

exports.changeUsername = asyncHandler(async (req, res) => {

  await service.changeUsername(
    req.user.user_id,
    req.body.new_username
  );

  res.status(200).json({
    status: "success",
    message: "Username updated"
  });

});