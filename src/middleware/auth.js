const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("No token provided");
    }
    // Verify the token

    const decoded = jwt.verify(token, "DEV@TINDER$2127");

    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    // Attach user to request object
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};

module.exports = { userAuth };
