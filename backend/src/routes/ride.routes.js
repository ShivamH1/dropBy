const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/create",
  authMiddleware.authUser,
  [
    body("pickup")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Invalid pickup address"),
    body("destination")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Invalid destination address"),
    body("vehicleType")
      .isString()
      .isIn(["auto", "car", "moto"])
      .withMessage("Invalid vehicle type"),
  ],
  rideController.createRide
);

router.post(
  "/get-fare",
  authMiddleware.authUser,
  [
    body("pickup").notEmpty().withMessage("Pickup is required"),
    body("pickup").isString().withMessage("Pickup must be a string"),
    body("pickup")
      .isLength({ min: 3 })
      .withMessage("Pickup must be at least 3 characters"),
    body("destination").notEmpty().withMessage("Destination is required"),
    body("destination").isString().withMessage("Destination must be a string"),
    body("destination")
      .isLength({ min: 3 })
      .withMessage("Destination must be at least 3 characters"),
  ],
  rideController.getFare
);

module.exports = router;
