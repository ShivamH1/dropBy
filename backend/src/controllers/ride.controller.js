const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");

async function createRide(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });
    res.status(201).json({ ride, message: "Ride created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
}

module.exports = {
  createRide,
};
