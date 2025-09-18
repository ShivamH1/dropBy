const blackListTokenModel = require("../models/blackListToken.model");
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
    // const token = await user.generateAuthenticationToken();
    // res.cookie("token", token);

    res.status(201).json({ user, message: "Registration successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

const userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await userService.loginUser({ email, password });

    const token = await user.generateAuthenticationToken();
    res.cookie("token", token);
    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({ token, user, message: "Login successful" });
  } catch (error) {
    res.status(401).json({ error: error.message });
    console.error(error);
  }
};

const userProfile = async (req, res, next) => {
  res
    .status(200)
    .json({ user: req.user, message: "Profile fetched successfully" });
};

const userLogout = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.headers.authorization.split(" ")[1] || req.cookies.token;
  await blackListTokenModel.create({ token });
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  userRegister,
  userLogin,
  userProfile,
  userLogout,
};
