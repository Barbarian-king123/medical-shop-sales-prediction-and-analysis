const asyncHandler = require("../../utils/asyncHandler");
const service = require("./dashboard.service");

exports.getDashboard = asyncHandler(async (req, res) => {

  const data = await service.getDashboardData(req.user);

  res.status(200).json({
    status: "success",
    data
  });
});