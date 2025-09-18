const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListToken.model");

const authUser = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const blackListToken = await blackListTokenModel.findOne({ token: token });
  if (blackListToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authUser;
