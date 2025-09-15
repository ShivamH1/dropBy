const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

router.post("/register", [
  body("fullName.firstName").notEmpty().withMessage("First name is required"),
  body("fullName.firstName")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters"),
  body("fullName.lastName").notEmpty().withMessage("Last name is required"),
  body("fullName.lastName")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters"),
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
], userController.userRegister);

module.exports = router;
