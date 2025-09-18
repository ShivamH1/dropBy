const captainsModel = require("../models/captainsModel");

const createCaptain = async ({
  firstName,
  lastName,
  email,
  password,
  color,
  plateNumber,
  capacity,
  vehicleType,
}) => {
  if (
    !firstName ||
    !email ||
    !password ||
    !color ||
    !plateNumber ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All required fields must be provided");
  }

  try {
    const captain = await captainsModel.create({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
      vehicle: {
        color,
        plateNumber,
        capacity,
        vehicleType,
      },
    });

    return captain;
  } catch (error) {
    console.error("Captain creation error: ", error);
    throw new Error(error.message);
  }
};

module.exports = {
  createCaptain,
};
