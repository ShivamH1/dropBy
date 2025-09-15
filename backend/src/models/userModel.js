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

userSchema.methods.generateAuthenticationToken = async () => {
  try {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
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
