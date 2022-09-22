const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const statusMiddleware = require("../middlewares/statusMiddleware");

router.post(
  "/login",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Login bo'sh bo'lishi mumkin emas")
    .isLength({ min: 5 })
    .withMessage("Login eng kamida 5 ta belgidan iborat bo'lishi kerak"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Parol bo'sh bo'lishi mumkin emas"),

  authController.login
);
router.post(
  "/register",
  body("name")
    .notEmpty()
    .withMessage("Ism bo'sh bo'lishi mumkin emas")
    .isLength({ min: 3 })
    .withMessage("Ism eng kamida 3 ta belgidan iborat bo'lishi kerak"),
  body("password").notEmpty().withMessage("Parol bo'sh bo'lishi mumkin emas"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email bo'sh bo'lishi mumkin emas")
    .isLength({ min: 10 })
    .withMessage("Email eng kamida 10 ta belgidan iborat bo'lishi kerak"),
  authController.register
);

module.exports = router;
