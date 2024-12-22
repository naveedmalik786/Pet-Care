// IMPORTS -
const mongoose = require("mongoose");

// PET SCHEMA -
const petSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: [true, "Please enter the pet name"],
      maxLength: [30, "Pet name cannot exceed 30 characters"],
      minLength: [4, "Please enter a pet name with at least 5 characters"],
    },

    profile: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    ownerMessage: {
      type: String,
    },

    petType: {
      type: String,
      required: [true, "Please select the pet type"],
    },

    petBreed: {
      type: String,
      required: [true, "Please select the pet breed"],
    },

    petGender: {
      type: String,
      required: [true, "Please select the pet gender"],
    },

    petAge: {
      type: String,
      required: [true, "Please enter the pet age"],
    },

    petInterests: {
      type: String,
      maxLength: [200, "The description cannot exceed 200 characters"],
    },

    petPrecautions: {
      type: String,
      required: [true, "Please enter the pet precautions"],
      maxLength: [200, "The description cannot exceed 200 characters"],
    },

    availableForBorrow: {
      type: Boolean,
      enum: [true, false],
      required: [true, "Please select whether to borrow"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pet", petSchema);
