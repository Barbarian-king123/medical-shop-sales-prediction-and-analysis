const express = require("express");
const router = express.Router();

const controller = require("./sales.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// Sales allowed for Owner + Pharmacist + Staff
router.post(
  "/",
  authenticate,
  authorizeRoles("Owner", "Pharmacist", "Staff"),
  controller.createSale
);

module.exports = router;