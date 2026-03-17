const express = require("express");
const router = express.Router();

const controller = require("./inventory.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// Add stock (Owner + Pharmacist)
router.post(
  "/batch",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.addStockBatch
);

// View stock
router.get(
  "/search",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.searchInventory
);

router.get(
  "/:medicineId",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getStockByMedicine
);
router.post(
  "/adjust",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.adjustStock
);
router.get(
  "/movements/:medicineId",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getStockMovementsByMedicine
);
router.get(
  "/:medicineId/suppliers",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getSuppliersByMedicine
);

module.exports = router;