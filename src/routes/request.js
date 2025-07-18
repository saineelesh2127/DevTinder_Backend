const express = require("express");
const authRequest = express.Router();
const { userAuth } = require("../middleware/auth");

authRequest.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const User = req.user;
  console.log("Sending connection request from user");
  res.send(User.firstName + " Sent the request");
});

module.exports = authRequest;
