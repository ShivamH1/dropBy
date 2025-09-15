const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch(() => {
      console.log("DB connection failed");
    });
};

module.exports = dbConnect;
