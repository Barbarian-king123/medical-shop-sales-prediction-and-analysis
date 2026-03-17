const express = require("express");
const router = express.Router();

const controller = require("./supplier.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

router.post("/", authenticate, authorizeRoles("Owner"), controller.createSupplier);

router.get("/", authenticate, controller.getSuppliers);

router.get("/:id", authenticate, controller.getSupplierById);

router.patch("/:id", authenticate, authorizeRoles("Owner"), controller.updateSupplier);

router.patch("/:id/status", authenticate, authorizeRoles("Owner"), controller.updateSupplierStatus);

router.post("/:id/medicines", authenticate, authorizeRoles("Owner","Pharmacist"), controller.addSupplierMedicine);

router.get("/:id/medicines", authenticate, controller.getSupplierMedicines);

router.get("/:id/orders", authenticate, controller.getSupplierOrders);

module.exports = router;