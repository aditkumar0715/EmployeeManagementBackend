const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // verify token
    try {
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // console.log("Printing decode", decode);
      const user = await User.findById(decode?.id).select("-password");
      // console.log("printing the user", user);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid token, verification failed",
        });
      }
      req.user = user;
      next()
    } catch (error) {
      // verification unsuccessfull
      return res.status(401).json({
        success: false,
        message: "",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "something went wrong while validating the token",
    });
  }
};

// isEmployee
exports.isEmployee = async (req, res, next) => {
  // get data from req body
  try {
    if (req.user.accountType !== "Employee") {
      return res.status(401).json({
        success: false,
        message: "The route is protected for Employees only",
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

// isEmployer
exports.isEmployer = async (req, res, next) => {
  // get data from req body
  try {
    if (req.user.accountType !== "Employer") {
      return res.status(401).json({
        success: false,
        message: "The route is protected for Employer only",
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
