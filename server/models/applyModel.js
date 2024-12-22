// IMPORTS -
const mongoose = require("mongoose");

// APPLY SCHEMA -
const applySchema = new mongoose.Schema(
  {
    petOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    adopter: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    pet: {
      type: mongoose.Schema.ObjectId,
      ref: "Pet",
      required: true,
    },

    message: {
      type: String,
      maxLength: [200, "Message to pet owner cannot exceed 200 characters"],
      required: [true, "Please enter your message to pet owner"],
    },

    status: {
      type: String,
      enum: ["pending", "accept", "reject"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Apply", applySchema);
