const express = require("express");
const router = express.Router();

const controller = require("./orders.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// Get all purchase orders
router.get(
  "/",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getOrders
);

// Get single order
router.get(
  "/:orderId",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getOrderById
);

// Receive order (enter batch details)
router.post(
  "/:orderId/receive",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.receiveOrder
);
router.post(
  "/:orderId/cancel",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.cancelOrder
);


module.exports = router;