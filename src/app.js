const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const Validsignup = require("./utils/Validsignup");
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(cookieParser());
//signup
app.post("/signup", async (req, res) => {
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

//profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // Check if user exists
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//login
app.post("/login", async (req, res) => {
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

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const User = req.user;
  console.log("Sending connection request from user");
  res.send(User.firstName + " Sent the request");
});
connectDB()
  .then(() => {
    console.log("DB connection establised");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("DB connection failed");
  });
