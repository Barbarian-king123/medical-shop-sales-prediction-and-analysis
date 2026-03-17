const db = require("../../config/db");

exports.createInvoice = async (trx, data) => {
  const [invoice] = await trx("sales_master")
    .insert(data)
    .returning("*");

  return invoice;
};

exports.createSaleItem = async (trx, data) => {
  return trx("sales_items").insert(data);
};

exports.getAvailableBatches = async (trx, medicine_id) => {

  return trx("stock_batches")
    .where({ medicine_id })
    .andWhere("quantity", ">", 0)
    .orderBy([
      { column: "expiry_date", order: "asc" },
      { column: "batch_id", order: "asc" }
    ]);

};;
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
exports.getFirstAvailableBatch = async (medicine_id) => {

  return db("stock_batches")
    .where({ medicine_id })
    .andWhere("quantity", ">", 0)
    .orderBy([
      { column: "expiry_date", order: "asc" },
      { column: "batch_id", order: "asc" }
    ])
    .first();

};
exports.updateBatchQuantity = async (trx, batch_id, newQty) => {
  return trx("stock_batches")
    .where({ batch_id })
    .update({ quantity: newQty });
};

exports.createStockMovement = async (trx, data) => {
  return trx("stock_movements").insert(data);
};

exports.getMedicineById = async (trx, medicine_id) => {
  return trx("medicines")
    .where({ medicine_id })
    .first();
};