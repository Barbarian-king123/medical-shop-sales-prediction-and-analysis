const express = require("express");
const controller = require("./notification.controller");

const router = express.Router();

// ===============================
// GET NOTIFICATIONS
// ===============================
router.get("/", controller.getNotifications);

// ===============================
// RUN CHECKS
// ===============================
router.post("/check-expiry", controller.runExpiryCheck);
router.post("/check-stock", controller.runStockCheck);

// ===============================
// NEW ROUTES (IMPORTANT)
// ===============================

// Resolve single notification
router.patch("/:id/resolve", controller.resolveNotification);

// Clear all notifications
router.patch("/clear-all", controller.clearAllNotifications);
// NEW ROUTES

router.get("/low-stock", controller.getLowStockNotifications);

router.get("/expiry", controller.getExpiryNotifications);

module.exports = router;