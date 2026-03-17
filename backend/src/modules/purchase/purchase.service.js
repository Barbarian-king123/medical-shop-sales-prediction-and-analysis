const db = require("../../config/db");
const AppError = require("../../utils/AppError");
const repo = require("./purchase.repository");

// Create purchase order
exports.createPurchaseOrder = async (data, userId) => {

  const { supplier_id, items } = data;

  if (!supplier_id) {
    throw new AppError("Supplier ID required", 400);
  }

  if (!items || items.length === 0) {
    throw new AppError("Purchase order must contain items", 400);
  }

  return db.transaction(async (trx) => {

    // Validate supplier
    const supplier = await repo.getSupplierById(trx, supplier_id);

    if (!supplier) {
      throw new AppError("Invalid supplier ID", 404);
    }

    if (!supplier.is_active) {
      throw new AppError("Supplier is inactive", 400);
    }

    // Create purchase order
    const order = await repo.createOrder(trx, {
      supplier_id,
      ordered_by: userId,
      status: "Pending"
    });

    for (const item of items) {

      if (!item.medicine_id) {
        throw new AppError("Medicine ID required", 400);
      }

      if (item.quantity <= 0) {
        throw new AppError("Quantity must be greater than 0", 400);
      }

      if (item.unit_price <= 0) {
        throw new AppError("Unit price must be greater than 0", 400);
      }

      const medicine = await repo.getMedicineById(
        trx,
        item.medicine_id
      );

      if (!medicine) {
        throw new AppError(
          `Medicine ${item.medicine_id} not found`,
          404
        );
      }

      const relation = await repo.checkSupplierMedicine(
        trx,
        supplier_id,
        item.medicine_id
      );

      if (!relation) {
        throw new AppError(
          `Supplier does not supply medicine ${item.medicine_id}`,
          400
        );
      }

      // 🔹 Calculate line total
      const line_total = item.quantity * item.unit_price;

      // Insert order item
      await repo.createOrderItem(trx, {
        po_id: order.po_id,
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total
      });
    }

    return order;
  });
};

exports.receivePurchaseOrder = async (poId, batches) => {

  if (!poId) {
    throw new AppError("Purchase order ID required", 400);
  }

  if (!batches || batches.length === 0) {
    throw new AppError("Batch data required", 400);
  }

  return db.transaction(async (trx) => {

    // Check order exists
    const order = await repo.getOrderById(trx, poId);

    if (!order) {
      throw new AppError("Purchase order not found", 404);
    }

    if (order.status === "Delivered") {
      throw new AppError("Order already received", 400);
    }

    for (const batch of batches) {

      if (!batch.medicine_id || !batch.batch_number) {
        throw new AppError("Invalid batch data", 400);
      }

      const createdBatch = await repo.createBatch(trx, {
        medicine_id: batch.medicine_id,
        supplier_id: batch.supplier_id,
        batch_number: batch.batch_number,
        mfg_date: batch.mfg_date,
        expiry_date: batch.expiry_date,
        quantity: batch.quantity,
        purchase_price: batch.purchase_price,
        mrp: batch.mrp
      });

      await repo.createStockMovement(trx, {
        batch_id: createdBatch.batch_id,
        change_qty: batch.quantity,
        reason: "Purchase"
      });
    }

    await repo.updateOrderStatus(trx, poId, "Delivered");

    return { message: "Order received successfully" };
  });
};