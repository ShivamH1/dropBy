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
    res
      .status(201)
      .json({ captain, message: "Registration successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

module.exports = {
  captainRegister,
};
