const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup
exports.signup = async (req, res) => {
  try {
    // data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;

    // validate the data
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if password and confirm password are correct
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password an confirmPassword value does not match, please try again",
      });
    }

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
    });
    user.password = "password removed due to security issues.";
    // return res
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error while doing signup", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;

    // data validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    // check if user exits or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered please signup first",
      });
    }

    // generate JWT, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};

