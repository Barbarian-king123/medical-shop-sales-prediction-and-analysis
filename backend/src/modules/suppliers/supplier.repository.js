const db = require("../../config/db");

// ======================
// Create supplier
// ======================
exports.createSupplier = async (data) => {
  const [supplier] = await db("suppliers")
    .insert(data)
    .returning("*");

  return supplier;
};

// ======================
exports.findByName = async (name) => {
  return db("suppliers")
    .whereRaw("LOWER(supplier_name) = LOWER(?)", [name])
    .first();
};

// ======================
exports.getSuppliers = async () => {
  return db("suppliers")
    .select("*")
    .orderBy("supplier_name", "asc");
};

// ======================
exports.getSupplierById = async (id) => {
  return db("suppliers")
    .where({ supplier_id: id })
    .first();
};

// ======================
exports.updateSupplier = async (id, data) => {
  return db("suppliers")
    .where({ supplier_id: id })
    .update(data);
};

// ======================
exports.updateSupplierStatus = async (id, status) => {
  return db("suppliers")
    .where({ supplier_id: id })
    .update({ is_active: status });
};

// ======================
exports.getMedicineById = async (medicineId) => {
  return db("medicines")
    .where({ medicine_id: medicineId })
    .first();
};

// ======================
exports.getSupplierMedicine = async (supplierId, medicineId) => {
  return db("medicine_suppliers")
    .where({
      supplier_id: supplierId,
      medicine_id: medicineId
    })
    .first();
};

// ======================
// 🔥 NEW: Remove existing primary supplier
// ======================
exports.clearPrimarySupplier = async (medicineId) => {
  return db("medicine_suppliers")
    .where({ medicine_id: medicineId })
    .update({ is_primary: false });
};

// ======================
exports.addSupplierMedicine = async (data) => {
  return db("medicine_suppliers").insert(data);
};

// ======================
exports.getSupplierMedicines = async (supplierId) => {
  return db("medicine_suppliers as ms")
    .join("medicines as m", "ms.medicine_id", "m.medicine_id")
    .where("ms.supplier_id", supplierId)
    .select(
      "m.medicine_id",
      "m.name",
      "m.generic_name",
      "ms.last_purchase_price",
      "ms.lead_time_days",   // ✅ added
      "ms.is_primary"
    )
    .orderBy("m.name", "asc");
};

// ======================
exports.getSupplierOrders = async (supplierId) => {
  return db("purchase_orders")
    .where({ supplier_id: supplierId })
    .select("po_id", "order_date", "status")
    .orderBy("order_date", "desc");
};