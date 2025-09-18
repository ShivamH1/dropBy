const blackListTokenModel = require("../models/blackListToken.model");
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

const loginCaptain = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const captain = await captainsModel.findOne({ email }).select("+password");

    if (!captain) {
      throw new Error("Invalid email!");
    }

    const isPasswordValid = await captain.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid password!");
    }
    // Remove password from user object before returning
    captain.password = undefined;
    return captain;
  } catch (error) {
    console.error("Login error: ", error);
    throw new Error(error.message);
  }
};

const logoutCaptain = async ({ token }) => {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    await blackListTokenModel.create({ token });
  } catch (error) {
    console.error("Logout error: ", error);
    throw new Error(error.message);
  }
};

module.exports = {
  createCaptain,
  loginCaptain,
  logoutCaptain,
};
