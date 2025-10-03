const MapsService = require("./maps.service");
const crypto = require("crypto");
const rideModel = require("../models/rideModel");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const distanceTime = await MapsService.getDistanceAndTime(
    pickup,
    destination
  );

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  const fare = {
    auto:
      baseFare.auto +
      (distanceTime.data.route.distance.kilometers * perKmRate.auto +
        distanceTime.data.route.duration.minutes * perMinuteRate.auto),
    car:
      baseFare.car +
      (distanceTime.data.route.distance.kilometers * perKmRate.car +
        distanceTime.data.route.duration.minutes * perMinuteRate.car),
    moto:
      baseFare.moto +
      (distanceTime.data.route.distance.kilometers * perKmRate.moto +
        distanceTime.data.route.duration.minutes * perMinuteRate.moto),
  };

  return fare;
}

function getOTP(num) {
  function generateOTP() {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOTP();
}

async function createRide({ user, pickup, destination, vehicleType }) {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    otp: getOTP(4),
    fare: fare[vehicleType],
  });

  return ride;
}

async function confirmRide({ rideId, captain }) {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    }
  );

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
}

async function startRide({ rideId, otp, captain }) {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  ride.status = "ongoing";

  return ride;
}

async function endRide({ rideId, captain }) {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    }
  );

  return ride;
}

module.exports = {
  createRide,
  getFare,
  confirmRide,
  startRide,
  endRide,
};
