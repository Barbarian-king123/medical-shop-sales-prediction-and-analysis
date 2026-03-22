const express = require("express");
const controller = require("./notification.controller");

const router = express.Router();

/* =============================== */
/* GET NOTIFICATIONS */
/* =============================== */
router.get("/", controller.getNotifications);

/* =============================== */
/* RUN CHECKS */
/* =============================== */

// 🔥 Run both (recommended main endpoint)
router.post("/run-all", controller.runAllChecks);

// Individual checks (optional)
router.post("/check-expiry", controller.runExpiryCheck);
router.post("/check-stock", controller.runStockCheck);

/* =============================== */
/* SPECIFIC FETCH ROUTES */
/* =============================== */

// ⚠️ IMPORTANT: place these BEFORE :id route
router.get("/low-stock", controller.getLowStockNotifications);
router.get("/expiry", controller.getExpiryNotifications);

/* =============================== */
/* ACTION ROUTES */
/* =============================== */

// Clear all notifications
router.patch("/clear-all", controller.clearAllNotifications);

// Resolve single notification
router.patch("/:id/resolve", controller.resolveNotification);

module.exports = router;