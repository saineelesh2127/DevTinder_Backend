const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
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
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
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
    },
    bio: {
      type: String,
      default: "Hello, I am new here",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
