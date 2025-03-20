const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tasks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
