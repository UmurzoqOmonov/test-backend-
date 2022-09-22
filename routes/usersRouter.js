const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getAllUsers);
router.delete("/:id", usersController.deleteUser);
router.patch("/:id/status", usersController.updateStatus);

module.exports = router;
