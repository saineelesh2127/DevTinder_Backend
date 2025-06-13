const validator = require("validator");

const Validsignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol"
    );
  }
};

module.exports = Validsignup;
