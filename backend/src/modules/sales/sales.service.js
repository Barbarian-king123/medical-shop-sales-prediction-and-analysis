const db = require("../../config/db");
const AppError = require("../../utils/AppError");
const repo = require("./sales.repository");

exports.createSale = async (data, user_id) => {

  const { items } = data;

  if (!items || !items.length) {
    throw new AppError("Sale items required", 400);
  }

  return db.transaction(async (trx) => {

    // 1️⃣ Create invoice
    const invoice = await repo.createInvoice(trx, {
      user_id,
      total_sale_amount: 0,
      total_taxable_amount: 0,
      total_gst_amount: 0
    });

    let totalAmount = 0;
    let totalTaxable = 0;
    let totalGst = 0;

    // 2️⃣ Process sale items
    for (const item of items) {

      if (!item.medicine_id) {
        throw new AppError("Medicine ID required", 400);
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new AppError("Invalid quantity", 400);
      }

      const medicine = await repo.getMedicineById(
        trx,
        item.medicine_id
      );

      if (!medicine) {
        throw new AppError("Medicine not found", 404);
      }

      const gstRate = Number(medicine.gst_rate);
      let requiredQty = Number(item.quantity);

      // FIFO / FEFO batches
      const batches = await repo.getAvailableBatches(
        trx,
        item.medicine_id
      );

      if (!batches.length) {
        throw new AppError("Insufficient stock", 400);
      }

      for (const batch of batches) {

        if (requiredQty <= 0) break;

        const availableQty = Number(batch.quantity);

        if (availableQty <= 0) continue;

        const deductQty = Math.min(availableQty, requiredQty);
        const newQty = availableQty - deductQty;

        // Update stock
        await repo.updateBatchQuantity(
          trx,
          batch.batch_id,
          newQty
        );

        const unitMrp = Number(batch.mrp);

        // Extract GST from MRP
        const basePrice = Number(
          (unitMrp / (1 + gstRate / 100)).toFixed(2)
        );

        const gstPerUnit = Number(
          (unitMrp - basePrice).toFixed(2)
        );

        const taxableAmount = Number(
          (basePrice * deductQty).toFixed(2)
        );

        const gstAmount = Number(
          (gstPerUnit * deductQty).toFixed(2)
        );

        const lineTotal = Number(
          (unitMrp * deductQty).toFixed(2)
        );

        // Insert sale item
        await repo.createSaleItem(trx, {
          invoice_id: invoice.invoice_id,
          medicine_id: item.medicine_id,
          batch_id: batch.batch_id,
          quantity: deductQty,
          unit_price: unitMrp,
          gst_rate: gstRate,
          taxable_amount: taxableAmount,
          gst_amount: gstAmount,
          line_total: lineTotal
        });

        // Stock movement
        await repo.createStockMovement(trx, {
          batch_id: batch.batch_id,
          change_qty: -deductQty,
          reason: "Sale",
          reference_id: invoice.invoice_id
        });

        // Update totals
        totalAmount += lineTotal;
        totalTaxable += taxableAmount;
        totalGst += gstAmount;

        requiredQty -= deductQty;
      }

      // If still quantity required
      if (requiredQty > 0) {
        throw new AppError(
          "Insufficient stock across batches",
          400
        );
      }
    }

    // 3️⃣ Update invoice totals
    await trx("sales_master")
      .where({ invoice_id: invoice.invoice_id })
      .update({
        total_sale_amount: Number(totalAmount.toFixed(2)),
        total_taxable_amount: Number(totalTaxable.toFixed(2)),
        total_gst_amount: Number(totalGst.toFixed(2))
      });

    return {
      invoice_id: invoice.invoice_id,
      totalAmount: Number(totalAmount.toFixed(2)),
      totalTaxable: Number(totalTaxable.toFixed(2)),
      totalGst: Number(totalGst.toFixed(2))
    };

  });

};