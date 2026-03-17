const asyncHandler = require("../../utils/asyncHandler");
const service = require("./purchase.service");

// Create purchase order
exports.createPurchaseOrder = asyncHandler(async (req, res) => {

  const order = await service.createPurchaseOrder(
    req.body,
    req.user.user_id
  );

  res.status(201).json({
    status: "success",
    data: order
  });

});

// Get purchase orders
exports.getPurchaseOrders = asyncHandler(async (req, res) => {

  const orders = await service.getPurchaseOrders();

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders
  });

});

// Receive purchase order
exports.receivePurchaseOrder = asyncHandler(async (req, res) => {

  const poId = parseInt(req.params.poId);

  const result = await service.receivePurchaseOrder(
    poId,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: result
  });

});