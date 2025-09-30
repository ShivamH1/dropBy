const express = require("express");
const router = express.Router();
const mapsController = require("../controllers/maps.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { body } = require("express-validator");

/**
 * POST /api/maps/geocode
 * Convert an address to coordinates
 * Body: { address: "123 Main St, City, Country" }
 */
router.post(
  "/geocode",
  [
    body("address").notEmpty().withMessage("Address is required"),
    body("address")
      .isString()
      .withMessage("Address must be a string")
      .isLength({ min: 3 })
      .withMessage("Address must be at least 3 characters"),
  ],
  authMiddleware.authUser,
  mapsController.geocodeAddress
);

/**
 * POST /api/maps/reverse-geocode
 * Convert coordinates to an address
 * Body: { latitude: 40.7128, longitude: -74.0060 }
 */
router.post(
  "/reverse-geocode",
  [
    body("latitude").notEmpty().withMessage("Latitude is required"),
    body("latitude").isNumeric().withMessage("Latitude must be a number"),
    body("latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude must be between -90 and 90"),
    body("longitude").notEmpty().withMessage("Longitude is required"),
    body("longitude").isNumeric().withMessage("Longitude must be a number"),
    body("longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude must be between -180 and 180"),
  ],
  authMiddleware.authUser,
  mapsController.reverseGeocodeCoordinates
);

/**
 * POST /api/maps/distance
 * Get distance and estimated time between two addresses
 * Body: { origin: "Address 1", destination: "Address 2" }
 */
router.post(
  "/distance",
  [
    body("origin").notEmpty().withMessage("Origin is required"),
    body("origin").isString().withMessage("Origin must be a string"),
    body("origin")
      .isLength({ min: 3 })
      .withMessage("Origin must be at least 3 characters"),
    body("destination").notEmpty().withMessage("Destination is required"),
    body("destination").isString().withMessage("Destination must be a string"),
    body("destination")
      .isLength({ min: 3 })
      .withMessage("Destination must be at least 3 characters"),
  ],
  authMiddleware.authUser,
  mapsController.getDistanceAndTime
);

/**
 * POST /api/maps/suggestions
 * Get address suggestions/autocomplete based on partial input
 * Body: { query: "New Y", limit: 5, country: "US", language: "en" }
 */
router.post(
  "/suggestions",
  [
    body("query").notEmpty().withMessage("Query is required"),
    body("query")
      .isString()
      .withMessage("Query must be a string")
      .isLength({ min: 2 })
      .withMessage("Query must be at least 2 characters"),
    body("limit")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Limit must be between 1 and 10"),
    body("country")
      .optional()
      .isString()
      .withMessage("Country must be a string"),
    body("proximity")
      .optional()
      .isString()
      .withMessage("Proximity must be a string (longitude,latitude)"),
    body("bbox")
      .optional()
      .isString()
      .withMessage("Bbox must be a string (minX,minY,maxX,maxY)"),
    body("language")
      .optional()
      .isString()
      .isLength({ min: 2, max: 2 })
      .withMessage("Language must be a 2-character language code"),
  ],
  authMiddleware.authUser,
  mapsController.getAutoCompleteSuggestions
);

module.exports = router;
