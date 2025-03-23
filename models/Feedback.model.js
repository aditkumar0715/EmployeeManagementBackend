const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    employee: {
      type: String,
      default: "Anonymous",
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
