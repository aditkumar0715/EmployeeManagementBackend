const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      // verification unsuccessfull
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "something went wrong while validating the token",
    });
  }
};


// isStudent
exports.isStudent = async (req, res, next) => {
  // get data from req body
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "The route is protected for students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can not be verified",
    });
  }
};


// isInstructor
exports.isInstructor = async (req, res, next) => {
  // get data from req body
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "The route is protected for instructor only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can not be verified",
    });
  }
};


// isAdmin
exports.isAdmin = async (req, res, next) => {
  // get data from req body
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "The route is protected for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can not be verified",
    });
  }
};
