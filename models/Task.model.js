const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["High", "Mid", "Low"],
      default: "Mid",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Done", "Delayed"],
      default: "Pending",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    attatchments: {
      type: [String],
      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
