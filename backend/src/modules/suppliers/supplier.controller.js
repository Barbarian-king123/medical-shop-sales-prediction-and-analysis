const asyncHandler = require("../../utils/asyncHandler");
const service = require("./suppliers.service");

// Create supplier
exports.createSupplier = asyncHandler(async (req, res) => {

  const supplier = await service.createSupplier(req.body);

  res.status(201).json({
    status: "success",
    data: supplier
  });

});

// Get suppliers
exports.getSuppliers = asyncHandler(async (req, res) => {

  const suppliers = await service.getSuppliers();

  res.status(200).json({
    status: "success",
    results: suppliers.length,
    data: suppliers
  });

});

// Get supplier by id
exports.getSupplierById = asyncHandler(async (req, res) => {

  const supplier = await service.getSupplierById(req.params.id);

  res.status(200).json({
    status: "success",
    data: supplier
  });

});

// Update supplier
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

// Update supplier status
exports.updateSupplierStatus = async (req, res) => {

  try {

    const result = await service.updateSupplierStatus(
      req.params.id
    );

    res.status(200).json({
      status: "success",
      data: result
    });

  } catch (err) {

    res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message
    });

  }

};

// Assign medicine
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

// Get supplier medicines
exports.getSupplierMedicines = async (req, res) => {

  const medicines = await service.getSupplierMedicines(
    req.params.id
  );

  res.status(200).json({
    status: "success",
    data: medicines
  });

};

// Get supplier purchase orders
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