const express = require("express");

const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const Validsignup = require("./utils/Validsignup");
const bcrypt = require("bcrypt");
app.use(express.json());
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

//login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    } else {
      res.send("Login successful");
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//find user by emailid
app.get("/user", async (req, res) => {
  const useremail = req.body.emailId;
  try {
    const users = await User.find({ emailId: useremail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//find all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//delete an user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//update an user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_FIELDS = ["photoUrl", "bio", "skills", "age", "gender"];
    const isValidOperation = Object.keys(data).every((key) =>
      ALLOWED_FIELDS.includes(key)
    );
    if (!isValidOperation) {
      return res.status(400).send("Invalid update fields");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
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
