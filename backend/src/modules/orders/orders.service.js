const db = require("../../config/db");
const repo = require("./orders.repository");
const AppError = require("../../utils/AppError");

exports.getOrders = async (status) => {

  if (status) {

    const allowed = [
      "pending",
      "delivered",
      "cancelled",
      "partially delivered"
    ];

    const normalizedStatus = status.toLowerCase();

    if (!allowed.includes(normalizedStatus)) {
      throw new AppError("Invalid order status filter", 400);
    }

    return repo.getOrders(normalizedStatus);
  }

  return repo.getOrders();

};

exports.getOrderById = async (orderId) => {

  const order = await repo.getOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;

};

exports.receiveOrder = async (orderId, batches) => {

  if (!orderId) {
    throw new AppError("Order ID required", 400);
  }

  if (!batches || batches.length === 0) {
    throw new AppError("Batch data required", 400);
  }

  return db.transaction(async (trx) => {

    const order = await repo.getOrderByIdTx(trx, orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.status === "Delivered") {
      throw new AppError("Order already delivered", 400);
    }

    if (order.status === "Cancelled") {
      throw new AppError("Cancelled orders cannot be received", 400);
    }

    for (const batch of batches) {

      if (!batch.medicine_id) {
        throw new AppError("Medicine ID required", 400);
      }

      if (!batch.batch_number) {
        throw new AppError("Batch number required", 400);
      }

      if (batch.quantity <= 0) {
        throw new AppError("Quantity must be greater than 0", 400);
      }

      if (batch.expiry_date <= batch.mfg_date) {
        throw new AppError("Expiry date must be after manufacturing date", 400);
      }

      const orderItem = await repo.getOrderItem(
        trx,
        orderId,
        batch.medicine_id
      );

      if (!orderItem) {
        throw new AppError(
          `Medicine ${batch.medicine_id} not part of this order`,
          400
        );
      }

      const receivedQty = await repo.getReceivedQuantity(
        trx,
        orderId,
        batch.medicine_id
      );

      const remainingQty = orderItem.quantity - receivedQty;

      if (batch.quantity > remainingQty) {
        throw new AppError(
          `Received quantity exceeds ordered quantity`,
          400
        );
      }

      const existingBatch = await repo.getBatchByNumber(
        trx,
        batch.batch_number
      );

      if (existingBatch) {
        throw new AppError(
          `Batch ${batch.batch_number} already exists`,
          400
        );
      }

      const createdBatch = await repo.createBatch(trx, {
        medicine_id: batch.medicine_id,
        supplier_id: order.supplier_id,
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
        reason: "Purchase",
        reference_id: orderId
      });

    }

    // 🔹 Check if full order is received
    const items = await repo.getOrderItems(trx, orderId);

    let fullyReceived = true;

    for (const item of items) {

      const receivedQty = await repo.getReceivedQuantity(
        trx,
        orderId,
        item.medicine_id
      );

      if (receivedQty < item.quantity) {
        fullyReceived = false;
        break;
      }

    }

    if (fullyReceived) {
      await repo.updateOrderStatus(trx, orderId, "Delivered");
    } else {
      await repo.updateOrderStatus(trx, orderId, "Partially Delivered");
    }

    return { message: "Order received successfully" };

  });

};

exports.cancelOrder = async (orderId) => {

  if (!orderId) {
    throw new AppError("Order ID required", 400);
  }

  const order = await repo.getOrderById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status === "Cancelled") {
    throw new AppError("Order already cancelled", 400);
  }

  if (order.status === "Delivered") {
    throw new AppError("Delivered orders cannot be cancelled", 400);
  }

  if (order.status === "Partially Delivered") {
    throw new AppError(
      "Partially delivered orders cannot be cancelled",
      400
    );
  }

  await repo.updateOrderStatus(null, orderId, "Cancelled");

  return {
    message: "Order cancelled successfully"
  };

};