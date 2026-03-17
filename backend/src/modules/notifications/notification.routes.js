const express = require("express");
const controller = require("./notification.controller");

const router = express.Router();

router.get("/",controller.getNotifications);

router.post("/check-expiry",controller.runExpiryCheck);

router.post("/check-stock",controller.runStockCheck);

module.exports = router;