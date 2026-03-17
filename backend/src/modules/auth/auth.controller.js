const asyncHandler = require("../../utils/asyncHandler");
const service = require("./auth.service");

exports.register = asyncHandler(async (req, res) => {
  const result = await service.register(req.body);
  res.status(201).json(result);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await service.login(req.body);
  res.status(200).json(result);
});