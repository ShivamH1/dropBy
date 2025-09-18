const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../controllers/captain.contoller");
const authUser = require("../middlewares/auth.middleware");

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
  body("vehicle.color").notEmpty().withMessage("Color is required"),
  body("vehicle.plateNumber").notEmpty().withMessage("Plate number is required"),
  body("vehicle.capacity").notEmpty().withMessage("Capacity is required"),
  body("vehicle.capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
  body("vehicle.vehicleType").notEmpty().withMessage("Vehicle type is required"),
  body("vehicle.vehicleType").isIn(["car", "motorcycle", "auto rickshaw"]).withMessage("Invalid vehicle type")
], captainController.captainRegister);

router.post("/login", [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Email is not valid"),
  body("password").notEmpty().withMessage("Password is required"),
], captainController.captainLogin);

router.get("/profile", authUser.authCaptain, captainController.captainProfile);

router.post("/logout", authUser.authCaptain, captainController.captainLogout);

module.exports = router;
