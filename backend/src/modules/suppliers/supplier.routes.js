const express = require("express");
const router = express.Router();

const controller = require("./supplier.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// ======================
// Supplier CRUD
// ======================

// Create supplier
router.post(
  "/",
  authenticate,
  authorizeRoles("Owner"),
  controller.createSupplier
);

// Get all suppliers
router.get(
  "/",
  authenticate,
  controller.getSuppliers
);

// Get supplier by ID
router.get(
  "/:id",
  authenticate,
  controller.getSupplierById
);

// Update supplier
router.patch(
  "/:id",
  authenticate,
  authorizeRoles("Owner"),
  controller.updateSupplier
);

// Toggle supplier status
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("Owner"),
  controller.updateSupplierStatus
);


// ======================
// Supplier ↔ Medicines
// ======================

// Assign medicine to supplier
router.post(
  "/:id/medicines",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.addSupplierMedicine
);

// Get medicines of supplier
router.get(
  "/:id/medicines",
  authenticate,
  controller.getSupplierMedicines
);

// 🔥 NEW: Remove medicine from supplier
router.delete(
  "/:id/medicines/:medicineId",
  authenticate,
  authorizeRoles("Owner"),
  controller.removeSupplierMedicine
);

// 🔥 NEW: Update supplier-medicine details (price, lead time, primary)
router.patch(
  "/:id/medicines/:medicineId",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.updateSupplierMedicine
);


// ======================
// Supplier Orders
// ======================

// Get supplier orders
router.get(
  "/:id/orders",
  authenticate,
  controller.getSupplierOrders
);


// ======================
// 🔥 OPTIONAL (Advanced)
// ======================

// Get primary supplier for a medicine
router.get(
  "/primary/:medicineId",
  authenticate,
  controller.getPrimarySupplier
);

// Get best supplier (based on logic)
router.get(
  "/best/:medicineId",
  authenticate,
  controller.getBestSupplier
);

module.exports = router;