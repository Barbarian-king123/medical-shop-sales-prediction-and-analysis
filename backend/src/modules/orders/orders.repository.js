const db = require("../../config/db");


// Get all orders
exports.getOrders = async (status) => {

  const query = db("purchase_orders as po")
    .join("suppliers as s", "po.supplier_id", "s.supplier_id")
    .leftJoin("purchase_order_items as poi", "po.po_id", "poi.po_id")
    .leftJoin("medicines as m", "poi.medicine_id", "m.medicine_id")
    .select(
      "po.po_id",
      "po.status",
      "po.order_date",
      "s.supplier_name"
    )
    .groupBy("po.po_id", "s.supplier_name")
    .select(
      db.raw("STRING_AGG(m.name, ', ') as medicines")
    )
    .orderBy("po.order_date", "desc");

  if (status) {
    query.whereRaw("LOWER(po.status) = ?", [status]);
  }

  return query;
};


// Get single order (normal query)
exports.getOrderById = async (orderId) => {

  return db("purchase_orders")
    .where({ po_id: orderId })
    .first();

};



// Get single order inside transaction
exports.getOrderByIdTx = async (trx, orderId) => {

  return trx("purchase_orders")
    .where({ po_id: orderId })
    .first();

};



// Get order item (used to validate medicine belongs to order)
exports.getOrderItem = async (trx, orderId, medicineId) => {

  return trx("purchase_order_items")
    .where({
      po_id: orderId,
      medicine_id: medicineId
    })
    .first();

};



// Insert batch when order is received
exports.createBatch = async (trx, data) => {

  const [batch] = await trx("stock_batches")
    .insert(data)
    .returning("*");

  return batch;

};



// Insert stock movement
exports.createStockMovement = async (trx, data) => {

  return trx("stock_movements")
    .insert({
      batch_id: data.batch_id,
      change_qty: data.change_qty,
      reason: data.reason,
      reference_id: data.reference_id
    });

};



// Update purchase order status
exports.updateOrderStatus = async (trx, orderId, status) => {

  const dbConn = trx || db;

  return dbConn("purchase_orders")
    .where({ po_id: orderId })
    .update({ status });

};



// Check duplicate batch number
exports.getBatchByNumber = async (trx, batchNumber) => {

  return trx("stock_batches")
    .where({ batch_number: batchNumber })
    .first();

};



// Get received quantity for a medicine in this order
exports.getReceivedQuantity = async (trx, orderId, medicineId) => {

  const result = await trx("stock_movements as sm")
    .join("stock_batches as sb", "sm.batch_id", "sb.batch_id")
    .where({
      "sm.reference_id": orderId,
      "sb.medicine_id": medicineId
    })
    .sum("sm.change_qty as total")
    .first();

  return result.total || 0;

};

exports.getOrderItems = async (trx, orderId) => {

  return trx("purchase_order_items")
    .where({ po_id: orderId });

};
exports.getMedicineByName = async (trx, name) => {
  return trx("medicines")
    .whereRaw("LOWER(name) = LOWER(?)", [name])
    .first();
};