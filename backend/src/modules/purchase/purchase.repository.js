const db = require("../../config/db");

// Create purchase order
exports.createOrder = async (trx, data) => {
  const [order] = await trx("purchase_orders")
    .insert(data)
    .returning("*");

  return order;
};

// Add items to purchase order
exports.createOrderItem = async (trx, data) => {
  return trx("purchase_order_items").insert(data);
};

// Get all purchase orders
exports.getPurchaseOrders = async () => {
  return db("purchase_orders as po")
    .leftJoin("suppliers as s", "po.supplier_id", "s.supplier_id")
    .select(
      "po.po_id",
      "po.status",
      "po.order_date",
      "s.supplier_name"
    )
    .orderBy("po.order_date", "desc");
};

// Get purchase order by ID
exports.getOrderById = async (trx, poId) => {
  return trx("purchase_orders")
    .where({ po_id: poId })
    .first();
};

// Create stock batch when order received
exports.createBatch = async (trx, data) => {
  const [batch] = await trx("stock_batches")
    .insert(data)
    .returning("*");

  return batch;
};

// Create stock movement
exports.createStockMovement = async (trx, data) => {
  return trx("stock_movements").insert(data);
};

// Update order status
exports.updateOrderStatus = async (trx, poId, status) => {
  return trx("purchase_orders")
    .where({ po_id: poId })
    .update({ status });
};

// Check if supplier supplies medicine
exports.checkSupplierMedicine = async (trx, supplierId, medicineId) => {
  return trx("medicine_suppliers")
    .where({
      supplier_id: supplierId,
      medicine_id: medicineId
    })
    .first();
};

// 🔹 NEW: Check supplier exists
exports.getSupplierById = async (trx, supplierId) => {
  return trx("suppliers")
    .where({ supplier_id: supplierId })
    .first();
};

// 🔹 NEW: Check medicine exists
exports.getMedicineById = async (trx, medicineId) => {
  return trx("medicines")
    .where({ medicine_id: medicineId })
    .first();
};
// Get purchase order by ID
exports.getOrderById = async (trx, poId) => {
  return trx("purchase_orders")
    .where({ po_id: poId })
    .first();
};

// Create stock batch
exports.createBatch = async (trx, data) => {
  const [batch] = await trx("stock_batches")
    .insert(data)
    .returning("*");

  return batch;
};

// Create stock movement
exports.createStockMovement = async (trx, data) => {
  return trx("stock_movements").insert(data);
};

// Update purchase order status
exports.updateOrderStatus = async (trx, poId, status) => {
  return trx("purchase_orders")
    .where({ po_id: poId })
    .update({ status });
};