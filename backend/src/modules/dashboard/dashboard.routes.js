const express = require("express");
const router = express.Router();

const controller = require("./dashboard.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

router.get(
  "/summary",
  authenticate, // your JWT middleware
  controller.getDashboard
);

module.exports=router;