const AppError = require("../../utils/AppError");
const repo = require("./medicines.repository");

exports.createMedicine = async (data) => {
  const { name } = data;

  if (!name) {
    throw new AppError("Medicine name is required", 400);
  }

  const existing = await repo.findByName(name);

  if (existing) {
    throw new AppError("Medicine already exists", 409);
  }

  return repo.createMedicine(data);
};

exports.getAllMedicines = async () => {
  return repo.getAllMedicines();
};

exports.updateMedicine = async (id, data) => {
  const medicine = await repo.findById(id);

  if (!medicine) {
    throw new AppError("Medicine not found", 404);
  }

  return repo.updateMedicine(id, data);
};

exports.deleteMedicine = async (id) => {
  const medicine = await repo.findById(id);

  if (!medicine) {
    throw new AppError("Medicine not found", 404);
  }

  return repo.softDeleteMedicine(id);
};


exports.searchMedicines = async (query) => {
  if (!query || query.length < 2) {
    throw new AppError("Minimum 2 characters required", 400);
  }

  const result = await repo.searchMedicines(query);

  return result;
};



exports.getMedicineBatches = async (medicineId) => {

  if (!medicineId) {
    throw new AppError("Medicine ID required", 400);
  }

  const batches = await repo.getBatchesByMedicineId(medicineId);

  if (!batches.length) {
    throw new AppError("No batches found", 404);
  }

  return batches;
};

exports.updateBatch = async (batchId, data) => {

  const { mrp, purchase_price } = data;

  if (!mrp || !purchase_price) {
    throw new AppError("MRP and Purchase Price required", 400);
  }

  if (mrp <= 0 || purchase_price <= 0) {
    throw new AppError("Values must be positive", 400);
  }

  const existing = await repo.getBatchById(batchId);

  if (!existing) {
    throw new AppError("Batch not found", 404);
  }

  return await repo.updateBatch(batchId, {
    mrp,
    purchase_price
  });
};


exports.searchMedicineForBilling = async (term) => {

  return repo.searchMedicineForBilling(term);

};