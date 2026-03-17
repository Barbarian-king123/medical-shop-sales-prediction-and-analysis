const repo = require("./supplier.repository");
const AppError = require("../../utils/AppError");

// Create supplier
exports.createSupplier = async (data) => {

  if (!data.supplier_name) {
    throw new AppError("Supplier name required", 400);
  }

  return repo.createSupplier(data);
};

// Get all suppliers
exports.getSuppliers = async () => {
  return repo.getSuppliers();
};

// Get supplier details
exports.getSupplierById = async (id) => {

  const supplier = await repo.getSupplierById(id);

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  return supplier;
};

// Update supplier
exports.updateSupplier = async (id, data) => {
  await repo.updateSupplier(id, data);
  return { message: "Supplier updated successfully" };
};

// Update supplier status
exports.updateSupplierStatus = async (id) => {

  const supplier = await repo.getSupplierById(id);

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  const newStatus = !supplier.is_active;

  await repo.updateSupplierStatus(id, newStatus);

  return {
    message: "Supplier status updated",
    is_active: newStatus
  };

};

// Assign medicine to supplier
exports.addSupplierMedicine = async (supplierId, data) => {

  if (!data.medicine_id) {
    throw new AppError("Medicine ID required", 400);
  }

  await repo.addSupplierMedicine({
    supplier_id: supplierId,
    medicine_id: data.medicine_id,
    last_purchase_price: data.last_purchase_price,
    is_primary: data.is_primary
  });

  return { message: "Medicine linked to supplier" };
};

// Get medicines supplied
exports.getSupplierMedicines = async (supplierId) => {

  const medicines = await repo.getSupplierMedicines(supplierId);

  return medicines;

};

// Get supplier orders
exports.getSupplierOrders = async (supplierId) => {
  return repo.getSupplierOrders(supplierId);
};