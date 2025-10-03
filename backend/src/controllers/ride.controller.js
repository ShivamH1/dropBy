const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapsService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/rideModel");

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

    // TODO: Send to ALL captains - no radius check for now
    const captainsModel = require("../models/captainsModel");
    const allCaptains = await captainsModel.find({ 
      socketId: { $exists: true, $ne: null } 
    });

    console.log(`Found ${allCaptains.length} captains with active socket connections`);

    ride.otp = "";

    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user");

    console.log("Broadcasting ride to all captains:", rideWithUser ? "Success" : "Failed to populate user");

    allCaptains.forEach((captain) => {
      console.log(`Sending to captain ${captain._id} with socketId: ${captain.socketId}`);
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });

    /* RADIUS-BASED CODE - DISABLED FOR TESTING
    const pickupCoordinates = await mapsService.getCoordinatesFromAddress(
      pickup
    );

    const captainsInRadius = await mapsService.getCaptainsInTheRadius(
      pickupCoordinates.ltd,
      pickupCoordinates.lng,
      2
    );

    ride.otp = "";

    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user");

    captainsInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
    */
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
}

async function confirmRide(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
      const ride = await rideService.confirmRide({ rideId, captain: req.captain });

      sendMessageToSocketId(ride.user.socketId, {
          event: "ride-confirmed",
          data: ride
      })

      return res.status(200).json(ride);
  } catch (err) {

      console.log(err);
      return res.status(500).json({ message: err.message });
  }
}

async function startRide(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.body;

  try {
      const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

      sendMessageToSocketId(ride.user.socketId, {
          event: "ride-started",
          data: ride
      })

      return res.status(200).json(ride);
  } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
  }
}

async function endRide(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
      const ride = await rideService.endRide({ rideId, captain: req.captain });

      sendMessageToSocketId(ride.user.socketId, {
          event: "ride-ended",
          data: ride
      })

      return res.status(200).json(ride);
  } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
  }
}

async function getFare(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { pickup, destination } = req.body;
  try {
    const fare = await rideService.getFare(pickup, destination);
    res.status(200).json({ fare, message: "Fare calculated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
}

module.exports = {
  createRide,
  getFare,
  confirmRide,
  startRide,
  endRide,
};
