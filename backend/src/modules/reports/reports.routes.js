const express = require("express");
const router = express.Router();

const controller = require("./reports.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");





router.get(
  "/summary",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.salesSummary
);
router.get(
  "/sales/generic",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.genericWiseSales
);

module.exports = router;