const userModel = require("../models/userModel");

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

module.exports = {
    createUser
}
