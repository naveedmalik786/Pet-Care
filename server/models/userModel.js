// IMPORTS -
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// USER SCHEMA -
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [
        4,
        "Please ensure that your name contains at least 5 characters",
      ],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [
        8,
        "Please ensure that your password contains at least 9 characters",
      ],
      validate: [
        validator.default.isStrongPassword,
        "Please use a strong password with atleast one uppercase letter, a special character, and a number",
      ],
      select: false,
    },

    location: {
      type: String,
      required: [true, "Please enter your location"],
    },

    phoneNo: {
      type: String,
      required: [true, "Please enter your phone number"],
    },

    role: {
      type: String,
      enum: ["admin", "user", "adopter"],
      default: "user",
    },
  },

  {
    timestamps: true,
  }
);

// MODIFY PASSWORD -
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN -
userSchema.methods.generateJwt = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// COMPARE PASSWORD -
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
