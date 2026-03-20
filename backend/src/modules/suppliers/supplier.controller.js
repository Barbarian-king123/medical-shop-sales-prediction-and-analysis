const asyncHandler = require("../../utils/asyncHandler");
const service = require("./suppliers.service");

// ======================
// Create supplier
// ======================
exports.createSupplier = asyncHandler(async (req, res) => {

  const supplier = await service.createSupplier(req.body);

  res.status(201).json({
    status: "success",
    data: supplier
  });

});

// ======================
// Get suppliers
// ======================
exports.getSuppliers = asyncHandler(async (req, res) => {

  const suppliers = await service.getSuppliers();

  res.status(200).json({
    status: "success",
    results: suppliers.length,
    data: suppliers
  });

});

// ======================
// Get supplier by ID
// ======================
exports.getSupplierById = asyncHandler(async (req, res) => {

  const supplier = await service.getSupplierById(req.params.id);

  res.status(200).json({
    status: "success",
    data: supplier
  });

});

// ======================
// Update supplier
// ======================
exports.updateSupplier = asyncHandler(async (req, res) => {

  const result = await service.updateSupplier(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: result
  });

});

// ======================
// Toggle supplier status
// ======================
exports.updateSupplierStatus = asyncHandler(async (req, res) => {

  const result = await service.updateSupplierStatus(
    req.params.id
  );

  res.status(200).json({
    status: "success",
    data: result
  });

});

// ======================
// Assign medicine
// ======================
exports.addSupplierMedicine = asyncHandler(async (req, res) => {

  const result = await service.addSupplierMedicine(
    req.params.id,
    req.body
  );

  res.status(201).json({
    status: "success",
    data: result
  });

});

// ======================
// 🔥 NEW: Update supplier-medicine
// ======================
exports.updateSupplierMedicine = asyncHandler(async (req, res) => {

  const result = await service.updateSupplierMedicine(
    req.params.id,
    req.params.medicineId,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: result
  });

});

// ======================
// 🔥 NEW: Remove supplier-medicine
// ======================
exports.removeSupplierMedicine = asyncHandler(async (req, res) => {

  const result = await service.removeSupplierMedicine(
    req.params.id,
    req.params.medicineId
  );

  res.status(200).json({
    status: "success",
    data: result
  });

});

// ======================
// Get supplier medicines
// ======================
exports.getSupplierMedicines = asyncHandler(async (req, res) => {

  const medicines = await service.getSupplierMedicines(
    req.params.id
  );

  res.status(200).json({
    status: "success",
    results: medicines.length,
    data: medicines
  });

});

// ======================
// Get supplier orders
// ======================
exports.getSupplierOrders = asyncHandler(async (req, res) => {

  const orders = await service.getSupplierOrders(
    req.params.id
  );

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders
  });

});

// ======================
// 🔥 NEW: Get primary supplier
// ======================
exports.getPrimarySupplier = asyncHandler(async (req, res) => {

  const supplier = await service.getPrimarySupplier(
    req.params.medicineId
  );

  res.status(200).json({
    status: "success",
    data: supplier
  });

});

// ======================
// 🔥 NEW: Get best supplier
// ======================
exports.getBestSupplier = asyncHandler(async (req, res) => {

  const supplier = await service.getBestSupplier(
    req.params.medicineId
  );

  res.status(200).json({
    status: "success",
    data: supplier
  });

});