const asyncHandler = require("../../utils/asyncHandler");
const service = require("./inventory.service");

exports.addStockBatch = asyncHandler(async (req, res) => {
  const batch = await service.addStockBatch(req.body);

  res.status(201).json({
    status: "success",
    data: batch,
  });
});

exports.getStockByMedicine = asyncHandler(async (req, res) => {
  const stock = await service.getStockByMedicine(
    req.params.medicineId
  );

  res.status(200).json({
    status: "success",
    results: stock.length,
    data: stock,
  });
});

exports.searchInventory = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const data = await service.searchInventory(query);

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

exports.adjustStock = asyncHandler(async (req, res) => {

  const result = await service.adjustStock(req.body);

  res.status(200).json({
    status: "success",
    data: result
  });

});

exports.getStockMovementsByMedicine = asyncHandler(async (req, res) => {

  const data = await service.getStockMovementsByMedicine(
    req.params.medicineId
  );

  res.status(200).json({
    status: "success",
    results: data.length,
    data
  });

});

exports.getSuppliersByMedicine = asyncHandler(async (req, res) => {

  const suppliers = await service.getSuppliersByMedicine(
    req.params.medicineId
  );

  res.status(200).json({
    status: "success",
    data: suppliers
  });

});