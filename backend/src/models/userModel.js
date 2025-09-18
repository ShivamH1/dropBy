const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: [3, "Last name must be at least 3 characters"],
      maxLength: 20,
    },
  },
  email: {
    type: String,
    required: true,
    minLength: [3, "Email must be at least 3 characters"],
    maxLength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [3, "Password must be at least 3 characters"],
    select: false,
  },
  socketId: {
    type: String,
  },
});


// The Problem:
// Arrow Function Context Issue: The generateAuthenticationToken method was using an arrow function (async () => {}), which doesn't bind this properly
// Missing User ID: When the JWT was created, this._id was undefined because arrow functions don't have their own this context
// Invalid Token Payload: This resulted in JWT tokens being generated without the user ID, only containing iat and exp (issued at and expiration time)
// Authentication Failure: When the auth middleware tried to find the user using decoded.id, it was undefined, causing "User not found" error

userSchema.methods.generateAuthenticationToken = async function () {
  try {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

userSchema.statics.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
