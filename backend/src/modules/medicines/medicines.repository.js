const db = require("../../config/db");

exports.createMedicine = async (data) => {
  const [medicine] = await db("medicines")
    .insert(data)
    .returning("*");

  return medicine;
};

exports.findByName = async (name) => {
  return db("medicines")
    .where({ name, is_active: true })
    .first();
};

exports.getAllMedicines = async () => {
  return db("medicines")
    .where({ is_active: true })
    .orderBy("created_at", "desc");
};

exports.findById = async (medicine_id) => {
  return db("medicines")
    .where({ medicine_id, is_active: true })
    .first();
};

exports.updateMedicine = async (medicine_id, data) => {
  const [updated] = await db("medicines")
    .where({ medicine_id })
    .update(data)
    .returning("*");

  return updated;
};

exports.softDeleteMedicine = async (medicine_id) => {
  const [deleted] = await db("medicines")
    .where({ medicine_id })
    .update({ is_active: false })
    .returning("*");

  return deleted;
};

exports.searchMedicines = async (query) => {
  return db("medicines as m")
    .join("stock_batches as sb", "sb.medicine_id", "m.medicine_id")
    .select(
      "m.medicine_id",
      "m.name",
      "m.generic_name",
      "m.gst_rate",
      db.raw("SUM(sb.quantity) as total_stock"),
      db.raw("MIN(sb.expiry_date) as nearest_expiry"),
      db.raw("MIN(sb.mrp) as mrp")
    )
    .whereRaw(
      "(m.name ILIKE ? OR m.generic_name ILIKE ?)",
      [`%${query}%`, `%${query}%`]
    )
    .andWhere("m.is_active", true)
    .andWhere("sb.expiry_date", ">", db.fn.now())
    .andWhere("sb.quantity", ">", 0)
    .groupBy("m.medicine_id")
    .orderBy("m.name")
    .limit(10);
};

exports.getBatchesByMedicineId = async (medicineId) => {
  return db("stock_batches")
    .where({ medicine_id: medicineId })
    .andWhere("quantity", ">", 0)
    .orderBy("expiry_date", "asc") // FEFO
    .select(
      "batch_id",
      "batch_number",
      "mfg_date",
      "expiry_date",
      "quantity",
      "purchase_price",
      "mrp"
    );
};

exports.getBatchById = async (batchId) => {
  return await db("stock_batches")
    .where({ batch_id: batchId })
    .first();
};

exports.updateBatch = async (batchId, data) => {
  const [updated] = await db("stock_batches")
    .where({ batch_id: batchId })
    .update({
      mrp: data.mrp,
      purchase_price: data.purchase_price
    })
    .returning("*");

  return updated;
};
exports.searchMedicineForBilling = async (term) => {

  return db("medicines as m")
    .join("stock_batches as sb", "m.medicine_id", "sb.medicine_id")
    .where("m.name", "ilike", `%${term}%`)
    .andWhere("sb.quantity", ">", 0)
    .select(
      "m.medicine_id",
      "m.name",
      "m.generic_name",
      "m.gst_rate",
      "sb.batch_id",
      "sb.batch_number",
      "sb.expiry_date",
      "sb.mrp"
    )
    .orderBy([
      { column: "sb.expiry_date", order: "asc" },
      { column: "sb.batch_id", order: "asc" }
    ])
    .limit(10);

};