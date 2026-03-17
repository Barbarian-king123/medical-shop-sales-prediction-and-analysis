const express = require("express");
const router = express.Router();

const controller = require("./users.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

router.use(authenticate);
router.use(authorizeRoles("Owner"));

router.get("/", controller.getUsers);

router.post("/", controller.createUser);

router.patch("/:id/username", controller.updateUsername);

router.patch("/:id/password", controller.resetPassword);

router.patch("/:id/role", controller.updateRole);

router.patch("/:id/status", controller.updateStatus);

module.exports = router;