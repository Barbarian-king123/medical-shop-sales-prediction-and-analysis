const asyncHandler = require("../../utils/asyncHandler");
const service = require("./orders.service");

exports.getOrders = asyncHandler(async (req, res) => {

  const { status } = req.query; // pending | delivered | cancelled

  const orders = await service.getOrders(status);

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders
  });

});

exports.getOrderById = asyncHandler(async (req, res) => {

  const order = await service.getOrderById(req.params.orderId);

  res.status(200).json({
    status: "success",
    data: order
  });

});

exports.receiveOrder = asyncHandler(async (req, res) => {

  const result = await service.receiveOrder(
    req.params.orderId,
    req.body.batches
  );

  res.status(200).json({
    status: "success",
    data: result
  });

});
exports.cancelOrder = asyncHandler(async (req, res) => {

  const result = await service.cancelOrder(req.params.orderId);

  res.status(200).json({
    status: "success",
    data: result
  });

});