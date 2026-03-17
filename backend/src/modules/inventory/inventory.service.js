const db = require("../../config/db");
const AppError = require("../../utils/AppError");
const repo = require("./inventory.repository");

exports.addStockBatch = async (data) => {
  const {
    medicine_id,
    batch_number,
    mfg_date,
    expiry_date,
    quantity,
    purchase_price,
    mrp,
  } = data;

  if (!medicine_id || !batch_number || !expiry_date || !quantity) {
    throw new AppError("Missing required fields", 400);
  }

  return db.transaction(async (trx) => {
    const batch = await repo.createBatch(trx, {
      medicine_id,
      batch_number,
      mfg_date,
      expiry_date,
      quantity,
      purchase_price,
      mrp,
    });

    await repo.createStockMovement(trx, {
      batch_id: batch.batch_id,
      change_qty: quantity,
      reason: "Purchase",
    });

    return batch;
  });
};

exports.getStockByMedicine = async (medicine_id) => {
  return repo.getStockByMedicine(medicine_id);
};

exports.searchInventory = async (query) => {
  if (!query || query.length < 2) {
    throw new AppError("Minimum 2 characters required", 400);
  }

  const medicines = await repo.searchInventory(query);

  for (const med of medicines) {
    med.batches = await repo.getBatchesByMedicine(
      med.medicine_id
    );
  }

  return medicines;
};
exports.adjustStock = async (data) => {

  const { batch_id, change_qty, reason } = data;

  if (!batch_id) {
    throw new AppError("Batch ID required", 400);
  }

  if (!reason) {
    throw new AppError("Adjustment reason required", 400);
  }

  if (change_qty === undefined || change_qty === 0) {
    throw new AppError("Change quantity must be non-zero", 400);
  }

  return db.transaction(async (trx) => {

    const batch = await repo.getBatchById(trx, batch_id);

    if (!batch) {
      throw new AppError("Batch not found", 404);
    }

    const newQty = batch.quantity + change_qty;

    // Prevent negative stock
    if (newQty < 0) {
      throw new AppError("Stock cannot go below zero", 400);
    }

    // Update batch quantity
    await repo.updateBatchQuantity(trx, batch_id, newQty);

    // Save movement history
    await repo.createStockMovement(trx, {
      batch_id,
      change_qty,
      reason
    });

    return {
      message: "Stock adjusted successfully",
      batch_id,
      previous_quantity: batch.quantity,
      new_quantity: newQty
    };

  });

};
exports.getStockMovementsByMedicine = async (medicineId) => {

  if (!medicineId) {
    throw new AppError("Medicine ID required", 400);
  }

  const movements = await repo.getStockMovementsByMedicine(medicineId);

  if (!movements || movements.length === 0) {
    throw new AppError("No stock movements found for this medicine", 404);
  }

  return movements;
};
exports.getSuppliersByMedicine = async (medicineId) => {

  if (!medicineId) {
    throw new AppError("Medicine ID required", 400);
  }

  return repo.getSuppliersByMedicine(medicineId);

};