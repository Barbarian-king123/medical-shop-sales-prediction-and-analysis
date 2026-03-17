const express = require("express");
const router = express.Router();
const authenticate = require("./middlewares/auth.middleware");

router.use("/auth", require("./modules/auth/auth.routes"));
router.use("/suppliers", require("./modules/suppliers/supplier.routes"));
router.use("/medicines", require("./modules/medicines/medicines.routes"));
router.use("/inventory", require("./modules/inventory/inventory.routes"));
router.use("/sales", require("./modules/sales/sales.routes"));
router.use("/reports", require("./modules/reports/reports.routes"));
router.use("/dashboard",require("./modules/dashboard/dashboard.routes"))
router.use("/purchase",require("./modules/purchase/purchase.routes"))
router.use("/orders",require("./modules/orders/orders.routes"))
router.use("/profile",require("./modules/profile/profile.routes"))
router.use("/users",require("./modules/users/users.routes"))
router.use("/analysis",require("./modules/analysis/analysis.routes"))
router.use("/notifications",require("./modules/notifications/notification.routes"))
// router.get("/protected", authenticate, (req, res) => {
//   res.json({
//     message: "Protected route accessed",
//     user: req.user,
//   });
// });

module.exports = router;