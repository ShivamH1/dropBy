const mapsService = require("../services/maps.service");
const { validationResult } = require("express-validator");

/**
 * Convert an address to coordinates (geocoding)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const geocodeAddress = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const result = await mapsService.getCoordinatesFromAddress(address);

    res.status(200).json({
      ...result,
      message: "Address geocoded successfully",
    });
  } catch (error) {
    console.error("Geocoding controller error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Convert coordinates to an address (reverse geocoding)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const reverseGeocodeCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude numbers are required",
      });
    }

    if (!mapsService.validateCoordinates(latitude, longitude)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
      });
    }

    const result = await mapsService.getAddressFromCoordinates(
      latitude,
      longitude
    );

    res.status(200).json({
      ...result,
      message: "Coordinates reverse geocoded successfully",
    });
  } catch (error) {
    console.error("Reverse geocoding controller error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get distance and duration between two addresses using OSRM routing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getDistanceAndTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: "Both origin and destination addresses are required",
      });
    }

    // Use the service method that integrates OSRM routing
    const result = await mapsService.getDistanceAndTime(origin, destination);

    res.status(200).json({
      ...result,
      message:
        "Distance and time calculated successfully using real routing data",
    });
  } catch (error) {
    console.error("Distance calculation controller error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get address suggestions/autocomplete based on partial input
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query, limit, country, proximity, bbox, language } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required for address suggestions",
      });
    }

    // Prepare options for the service
    const options = {};
    if (limit && typeof limit === "number" && limit > 0 && limit <= 10) {
      options.limit = limit;
    }
    if (country && typeof country === "string") {
      options.country = country;
    }
    if (proximity && typeof proximity === "string") {
      options.proximity = proximity;
    }
    if (bbox && typeof bbox === "string") {
      options.bbox = bbox;
    }
    if (language && typeof language === "string") {
      options.language = language;
    }

    // Use the service method for address suggestions
    const result = await mapsService.getAddressSuggestions(query, options);

    res.status(200).json({
      ...result,
      message: "Address suggestions retrieved successfully",
    });
  } catch (error) {
    console.error("Address suggestions controller error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  geocodeAddress,
  reverseGeocodeCoordinates,
  getDistanceAndTime,
  getAutoCompleteSuggestions,
};
