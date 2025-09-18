const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const captainsSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters"],
    },
    lastName: {
      type: String,
      minLength: [3, "Last name must be at least 3 characters"],
    },
  },
  email: {
    type: String,
    required: true,
    minLength: [3, "Email must be at least 3 characters"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  vehicle: {
    color: {
      type: String,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      minLength: [1, "Capacity must be at least 1"],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "motorcycle", "auto rickshaw"],
    },
  },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
});

// Methods vs Statics in Mongoose:
//
// METHODS (instance methods):
// - Use when you need to operate on a specific document instance
// - Called on individual documents: user.generateAuthenticationToken()
// - Have access to 'this' which refers to the document instance
// - Examples: generateAuthenticationToken(), comparePassword(), save(), validate()
//
// STATICS (static methods):
// - Use when you need to operate on the model/collection level
// - Called on the model itself: User.hashPassword()
// - Don't have access to 'this' referring to a document instance
// - Examples: hashPassword(), findByEmail(), createUser(), custom queries
//
// In this code:
// - generateAuthenticationToken() is a METHOD because it needs 'this._id' from the specific captain
// - comparePassword() is a METHOD because it needs 'this.password' from the specific captain
// - hashPassword() is a STATIC because it's a utility function that doesn't need document data

captainsSchema.methods.generateAuthenticationToken = async function () {
  try {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.error("error: ", error);
    throw new Error(error.message);
  }
};

captainsSchema.statics.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

captainsSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const captainsModel = mongoose.model("Captains", captainsSchema);

module.exports = captainsModel;
