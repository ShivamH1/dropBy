const userModel = require("../models/userModel");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

const userRegister = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;
  const hashedPassword = await userModel.hashPassword(password);

  try {
    const user = await userService.createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
    });
    const token = await user.generateAuthenticationToken();
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

module.exports = {
  userRegister,
};
