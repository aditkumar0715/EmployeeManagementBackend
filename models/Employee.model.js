const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  jobRole: {
    type: String,
    required: true,
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
  contact: {
    type: String,
    trim: true,
  },
  salary: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
