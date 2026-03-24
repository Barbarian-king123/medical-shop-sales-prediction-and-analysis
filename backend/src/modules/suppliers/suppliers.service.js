const repo = require("./supplier.repository");
const AppError = require("../../utils/AppError");

// ======================
exports.createSupplier = async (data) => {

  if (!data.supplier_name || data.supplier_name.trim() === "") {
    throw new AppError("Supplier name required", 400);
  }

  const existing = await repo.findByName(data.supplier_name);

  if (existing) {
    throw new AppError("Supplier already exists", 409);
  }

  return repo.createSupplier(data);
};

// ======================
exports.getSuppliers = async () => {
  return repo.getSuppliers();
};

// ======================
exports.getSupplierById = async (id) => {

  if (!id) throw new AppError("Supplier ID required", 400);

  const supplier = await repo.getSupplierById(id);

  if (!supplier) throw new AppError("Supplier not found", 404);

  return supplier;
};

// ======================
exports.updateSupplier = async (id, data) => {

  if (!id) throw new AppError("Supplier ID required", 400);

  const supplier = await repo.getSupplierById(id);
  if (!supplier) throw new AppError("Supplier not found", 404);

  if (data.supplier_name && data.supplier_name.trim() === "") {
    throw new AppError("Supplier name cannot be empty", 400);
  }

  await repo.updateSupplier(id, data);

  return { message: "Supplier updated successfully" };
};

// ======================
exports.updateSupplierStatus = async (id) => {

  if (!id) throw new AppError("Supplier ID required", 400);

  const supplier = await repo.getSupplierById(id);
  if (!supplier) throw new AppError("Supplier not found", 404);

  const newStatus = !supplier.is_active;

  await repo.updateSupplierStatus(id, newStatus);

  return {
    message: "Supplier status updated",
    is_active: newStatus
  };
};

// ======================
// 🔥 UPDATED: Assign medicine
// ======================
exports.addSupplierMedicine = async (supplierId, data) => {

  if (!supplierId) throw new AppError("Supplier ID required", 400);

  // ✅ NEW
  if (!data.medicine_name || data.medicine_name.trim() === "") {
    throw new AppError("Medicine name required", 400);
  }

  const supplier = await repo.getSupplierById(supplierId);
  if (!supplier) throw new AppError("Supplier not found", 404);

  // 🔍 Convert name → ID
  const medicine = await repo.getMedicineByName(data.medicine_name);

  if (!medicine) {
    throw new AppError(
      `Medicine '${data.medicine_name}' not found`,
      404
    );
  }

  data.medicine_id = medicine.medicine_id;

  const existing = await repo.getSupplierMedicine(
    supplierId,
    data.medicine_id
  );

  if (existing) {
    throw new AppError("Medicine already assigned to this supplier", 409);
  }

  if (data.lead_time_days && data.lead_time_days < 0) {
    throw new AppError("Lead time must be positive", 400);
  }

  if (data.is_primary) {
    await repo.clearPrimarySupplier(data.medicine_id);
  }

  await repo.addSupplierMedicine({
    supplier_id: supplierId,
    medicine_id: data.medicine_id,
    last_purchase_price: data.last_purchase_price || null,
    lead_time_days: data.lead_time_days || 3,
    is_primary: data.is_primary || false
  });

  return { message: "Medicine linked to supplier" };
};

// ======================
exports.getSupplierMedicines = async (supplierId) => {

  if (!supplierId) throw new AppError("Supplier ID required", 400);

  const supplier = await repo.getSupplierById(supplierId);
  if (!supplier) throw new AppError("Supplier not found", 404);

  return repo.getSupplierMedicines(supplierId);
};

// ======================
exports.getSupplierOrders = async (supplierId) => {

  if (!supplierId) throw new AppError("Supplier ID required", 400);

  const supplier = await repo.getSupplierById(supplierId);
  if (!supplier) throw new AppError("Supplier not found", 404);

  return repo.getSupplierOrders(supplierId);
};