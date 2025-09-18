const captainsModel = require("../models/captainsModel");
const { validationResult } = require("express-validator");
const captainService = require("../services/captain.service");

const captainRegister = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, email, password, vehicle } = req.body;

  const isCaptainExists = await captainsModel.findOne({ email });
  if (isCaptainExists) {
    return res.status(400).json({ error: "Captain already exists" });
  }

  const hashedPassword = await captainsModel.hashPassword(password);

  try {
    const captain = await captainService.createCaptain({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plateNumber: vehicle.plateNumber,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    // Using captain.generateAuthenticationToken() because it's an instance method
    // captain is the created document instance returned from captainService.createCaptain()
    // Instance methods are called on individual document instances, not on the model itself
    // captainsModel.generateAuthenticationToken() would be incorrect as it's not a static method

    // const token = await captain.generateAuthenticationToken();
    res.status(201).json({ captain, message: "Registration successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

const captainLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    const captain = await captainService.loginCaptain({ email, password });
    const token = await captain.generateAuthenticationToken();
    res.cookie("token", token);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ token, captain, message: "Login successful" });
  } catch (error) {
    res.status(401).json({ error: error.message });
    console.error(error);
  }
};

const captainProfile = async (req, res, next) => {
  res
    .status(200)
    .json({ captain: req.captain, message: "Profile fetched successfully" });
};

const captainLogout = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.headers.authorization.split(" ")[1] || req.cookies.token;
  await captainService.logoutCaptain({ token });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  captainRegister,
  captainLogin,
  captainProfile,
  captainLogout
};
