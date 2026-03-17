const asyncHandler = require("../../utils/asyncHandler");
const service = require("./sales.service");

exports.createSale = asyncHandler(async (req, res) => {
  const result = await service.createSale(
    req.body,
    req.user.user_id
  );

  res.status(201).json({
    status: "success",
    data: result,
  });
});