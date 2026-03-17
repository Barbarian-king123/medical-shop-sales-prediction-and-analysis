const express = require("express");
const router = express.Router();

const controller = require("./purchase.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// Create purchase order
router.post(
  "/",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.createPurchaseOrder
);

// Get all purchase orders
router.get(
  "/",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getPurchaseOrders
);

// Receive order
router.post(
  "/:poId/receive",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.receivePurchaseOrder
);

module.exports = router;