const asyncHandler = require("../../utils/asyncHandler");
const service = require("./medicines.service");

exports.createMedicine = asyncHandler(async (req, res) => {
  const medicine = await service.createMedicine(req.body);

  res.status(201).json({
    status: "success",
    data: medicine,
  });
});

exports.getAllMedicines = asyncHandler(async (req, res) => {
  const medicines = await service.getAllMedicines();

  res.status(200).json({
    status: "success",
    results: medicines.length,
    data: medicines,
  });
});

exports.updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await service.updateMedicine(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: medicine,
  });
});

exports.deleteMedicine = asyncHandler(async (req, res) => {
  await service.deleteMedicine(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Medicine deleted successfully",
  });
});


exports.searchMedicines = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const data = await service.searchMedicines(query);

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

exports.getBatches = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const data = await service.getMedicineBatches(id);

  res.status(200).json({
    status: "success",
    results: data.length,
    data
  });

});

exports.updateBatch = async (req, res, next) => {
  try {
    const batchId = req.params.id;
    const { mrp, purchase_price } = req.body;

    const updated = await service.updateBatch(batchId, {
      mrp,
      purchase_price,
    });

    res.status(200).json({
      status: "success",
      message: "Batch updated successfully",
      data: updated,
    });

  } catch (err) {
    next(err);
  }
};
exports.searchMedicines = async (req, res) => {

  const term = req.query.query;

  if (!term) {
    return res.status(200).json({
      status: "success",
      data: []
    });
  }

  const medicines = await service.searchMedicineForBilling(term);

  res.status(200).json({
    status: "success",
    data: medicines
  });

};