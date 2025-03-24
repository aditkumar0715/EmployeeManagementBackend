const mongoose = require("mongoose");
const Feedback = require("../models/Feedback.model");

const Employee = require("../models/Employee.model");

exports.createFeedback = async (req, res) => {
  try {
    const { isAnonymous, feedback } = req.body;
    if (!feedback)
      return res
        .status(402)
        .json({ success: false, message: "feedback is required" });

    let feedbackResponse = null;
    if (isAnonymous) {
      feedbackResponse = await Feedback.create({ feedback });
    } else {
      feedbackResponse = await Feedback.create({
        employee: req.user._id,
        feedback,
      });
    }

    if (!feedbackResponse)
      return res.status(402).json({
        success: false,
        message: "feedback creation failed",
      });

    return res.status(200).json({
      success: true,
      message: "feedback created successfully",
      data: feedbackResponse,
    });
  } catch (error) {
    console.log("Error while creating feedback: ", error.message);
    return res.status(501).json({
      success: false,
      message: "Unable to create feedback",
      error: error.message,
    });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const allFeedbacks = await Feedback.find();
    if (!allFeedbacks)
      return res.status(402).json({
        success: false,
        message: "Failed to fetch feedback",
      });
    res.status(200).json({
      success: true,
      message: "fetched all feedbacks",
      data: allFeedbacks,
    });
  } catch (error) {
    console.log("Error while fetching allFeedbacks: ", error.message);
    return res.status(501).json({
      success: false,
      message: "Unable to fetch AllFeedbacks",
      error: error.message,
    });
  }
};

exports.getOneFeedback = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res
        .status(401)
        .json({ success: false, message: "feedback id missing" });

    let feedback = await Feedback.findById(id);
    if (!feedback)
      return res.status(404).json({
        success: false,
        message: "Failed to fetch feedback",
      });
    
    if (feedback.employee !== "Anonymous") {
      feedback = feedback.toObject();
      const employee = await Employee.findOne({
        details: feedback.employee,
      }).populate(["department", "details"]);
      feedback.employee = !employee
        ? "Employee Not Found might have been deleted"
        : employee;

    }
    res.status(200).json({
      success: true,
      message: "fetched the feedback",
      data: { feedback },
    });
  } catch (error) {
    console.log("Error while fetching feedback: ", error.message);
    return res.status(501).json({
      success: false,
      message: "Unable to fetch feedback",
      error: error.message,
    });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res
        .status(401)
        .json({ success: false, message: "Feedback ID is required" });
    }

    // Delete the feedback
    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete feedback",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
      deletedFeedback,
    });
  } catch (error) {
    console.log("Error while deleting feedback: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete feedback",
      error: error.message,
    });
  }
};
