const express = require("express");
const router = express.Router();

const controller = require("./profile.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

router.get(
"/me",
authenticate,
controller.getProfile
);

router.patch(
"/change-password",
authenticate,
controller.changePassword
);

router.patch(
"/change-username",
authenticate,
authorizeRoles("Owner"),
controller.changeUsername
);

module.exports = router;