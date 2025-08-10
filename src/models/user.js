const mongoose = require("mongoose");
const validate = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      index: true,
      maxlength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validate.isEmail(value)) {
          throw new Error("Email is not valid " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate(value) {
        if (!validate.isStrongPassword(value)) {
          throw new Error(
            "password must contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
          );
        }
      },
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender value is not valid");
        }
      },
    },
    age: {
      type: Number,

      min: 18,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
      validate(value) {
        if (!validate.isURL(value)) {
          throw new Error("URL is not valid " + value);
        }
      },
    },
    bio: {
      type: String,
      default: "Hello, I am new here",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("You can only add up to 10 skills");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  // Generate a JWT token
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$2127", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordByUser, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
