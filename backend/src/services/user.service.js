const userModel = require("../models/userModel");
const blackListTokenModel = require("../models/blackListToken.model");

const createUser = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }

  try {
    const user = await userModel.create({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
    });

    return user;
  } catch (error) {
    console.error("error: ", error);
    throw new Error(error.message);
  }
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    // Include password in the query result for comparison
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("Invalid email!");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid password!");
    }

    // Remove password from user object before returning
    user.password = undefined;
    return user;
  } catch (error) {
    console.error("Login error: ", error);
    throw new Error(error.message);
  }
};

const logoutUser = async ({ token }) => {
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
  createUser,
  loginUser,
  logoutUser,
};
