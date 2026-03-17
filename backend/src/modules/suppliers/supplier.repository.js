const db = require("../../config/db");

// Create supplier
exports.createSupplier = async (data) => {
  const [supplier] = await db("suppliers")
    .insert(data)
    .returning("*");

  return supplier;
};

// Get all suppliers
exports.getSuppliers = async () => {
  return db("suppliers")
    .select("*")
    .orderBy("supplier_name");
};

// Get supplier by ID
exports.getSupplierById = async (id) => {
  return db("suppliers")
    .where({ supplier_id: id })
    .first();
};

// Update supplier
exports.updateSupplier = async (id, data) => {
  return db("suppliers")
    .where({ supplier_id: id })
    .update(data);
};

// Update supplier status
exports.updateSupplierStatus = async (id, status) => {

  return db("suppliers")
    .where({ supplier_id: id })
    .update({ is_active: status });

};

// Assign medicine to supplier
exports.addSupplierMedicine = async (data) => {
  return db("medicine_suppliers").insert(data);
};

// Get medicines supplied by supplier
exports.getSupplierMedicines = async (supplierId) => {

  return db("medicine_suppliers as ms")
    .join("medicines as m", "ms.medicine_id", "m.medicine_id")
    .where("ms.supplier_id", supplierId)
    .select(
      "m.medicine_id",
      "m.name",
      "m.generic_name",
      "ms.last_purchase_price",
      "ms.is_primary"
    )
    .orderBy("m.name", "asc");

};

// Get purchase orders from supplier
exports.getSupplierOrders = async (supplierId) => {
  return db("purchase_orders")
    .where({ supplier_id: supplierId })
    .select("po_id", "order_date", "status")
    .orderBy("order_date", "desc");
};