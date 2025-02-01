const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      required: true,
    },
    accountType: {
      type: String,
      default: "Employee",
      enum: ["Employer", "Employee"],
      required: true,
    },
    profileImg: {
      type: String,
      trim: true,
      default:
        "https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295396_1280.png",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
