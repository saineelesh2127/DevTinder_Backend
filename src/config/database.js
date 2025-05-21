const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://saineelesh2127:saineelesh2127@cluster0.ra22pdh.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
