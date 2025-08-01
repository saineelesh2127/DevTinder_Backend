const express = require("express");
const authRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Validsignup = require("../utils/Validsignup");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate user input
    Validsignup(req);
    const { firstName, lastName, emailId, password, gender } = req.body;
    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user]
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});

module.exports = authRouter;
