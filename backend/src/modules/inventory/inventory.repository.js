const db = require("../../config/db");

exports.createBatch = async (trx, data) => {
  const [batch] = await trx("stock_batches")
    .insert(data)
    .returning("*");

  return batch;
};

exports.createStockMovement = async (trx, data) => {
  return trx("stock_movements").insert(data);
};

exports.getStockByMedicine = async (medicine_id) => {
  return db("stock_batches")
    .where({ medicine_id })
    .andWhere("quantity", ">", 0)
    .orderBy("expiry_date", "asc");
};

exports.searchInventory = async (query) => {
  const medicines = await db("medicines as m")
    .leftJoin("stock_batches as sb", "sb.medicine_id", "m.medicine_id")
    .select(
      "m.medicine_id",
      "m.name",
      "m.generic_name",
      "m.atc_code",
      "m.hsn_code",
      "m.gst_rate",
      "m.is_active",
      db.raw("COALESCE(SUM(sb.quantity), 0) as total_stock")
    )
    .whereRaw(
      "(m.name ILIKE ? OR m.generic_name ILIKE ?)",
      [`%${query}%`, `%${query}%`]
    )
    .groupBy("m.medicine_id")
    .orderBy("m.name")
    .limit(10);

  return medicines;
};

exports.getBatchesByMedicine = async (medicine_id) => {
  return db("stock_batches")
    .select(
      "batch_id",
      "batch_number",
      "expiry_date",
      "quantity",
      "purchase_price",
      "mrp"
    )
    .where({ medicine_id })
    .orderBy("expiry_date", "asc");
};
/**
 * Get batch by ID
 */
exports.getBatchById = async (trx, batchId) => {
  return trx("stock_batches")
    .where({ batch_id: batchId })
    .first();
};

/**
 * Update batch quantity
 */
exports.updateBatchQuantity = async (trx, batchId, newQty) => {
  return trx("stock_batches")
    .where({ batch_id: batchId })
    .update({ quantity: newQty });
};

/**
 * Record stock movement
 */
exports.createStockMovement = async (trx, data) => {
  return trx("stock_movements").insert(data);
};
exports.getStockMovementsByMedicine = async (medicineId) => {
  return db("stock_movements as sm")
    .join("stock_batches as sb", "sm.batch_id", "sb.batch_id")
    .join("medicines as m", "sb.medicine_id", "m.medicine_id")
    .select(
      "sm.movement_id",
      "m.medicine_id",
      "m.name as medicine_name",
      "sb.batch_id",
      "sb.batch_number",
      "sm.change_qty",
      "sm.reason",
      "sm.created_at"
    )
    .where("m.medicine_id", medicineId)
    .orderBy("sm.created_at", "desc");
};

exports.getSuppliersByMedicine = async (medicineId) => {

  return db("medicine_suppliers as ms")
    .join("suppliers as s", "ms.supplier_id", "s.supplier_id")
    .select(
      "s.supplier_id",
      "s.supplier_name",
      "ms.last_purchase_price",
      "ms.is_primary"
    )
    .where("ms.medicine_id", medicineId)
    .andWhere("s.is_active", true)
    .orderBy("ms.is_primary", "desc");

};