const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { decrypt, encrypt } = require("../utils/encrypt");
const jwt = require("jsonwebtoken");

// signup
exports.signup = async (req, res, next) => {
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
    user.password = "removed due to security issues.";
    // return res
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error while doing signup", error);
    return res.status(501).json({
      success: false,
      message: "Unable to register user",
      error: error.message,
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
        message: "User is not registered",
      });
    }

    // generate JWT, after password matching
    const isPasswordMatched =
      user.accountType === "Employer"
        ? await bcrypt.compare(password, user.password)
        : password === decrypt(user.password);
    if (isPasswordMatched) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      });

      user.password = "removed due to security issues.";

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
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
    return res.status(501).json({
      success: false,
      message: "Unable to login",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res.status(200).clearCookie("token", options).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "Unable to logout",
      error: error.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "fetched my details",
    data: req.user,
  });
};

exports.updateUserDetails = async (req, res) => {
  try {
    // take required details from the user
    const { firstName, lastName, email, profileImg } = req.body;

    // validation
    if (!firstName || !lastName || !email || !profileImg)
      return res.status(402).json({
        success: false,
        message: "All fields are required",
      });

    const updatedDetails = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, email, profileImg },
      { new: true }
    );

    if (!updatedDetails)
      return res.status(402).json({
        success: false,
        message: "some error occured please try again",
      });

    return res.status(200).json({
      success: true,
      message: "updated user details",
      updatedData: updatedDetails,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: "unable to update user details",
      error: error.message,
    });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    // take required details from the user
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const { accountType, _id } = req.user;

    // validation
    if (!oldPassword || !newPassword || !confirmNewPassword)
      return res.status(402).json({
        success: false,
        message: "All fields are required",
      });

    if (!newPassword === confirmNewPassword)
      return res.status(401).json({
        success: false,
        message: "new password and confirm new passwor did not match",
      });

    const userData = await User.findById(_id);
    let dbResponse = null;
    if (accountType === "Employer") {
      if (!(await bcrypt.compare(oldPassword, userData.password)))
        return res.status(402).json({
          success: false,
          message: "oldPassword is not correct",
        });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dbResponse = await User.findByIdAndUpdate(_id, {
        password: hashedPassword,
      });
    } else {
      const password = decrypt(userData.password);
      if (!password === oldPassword)
        return res.status(402).json({
          success: false,
          message: "oldPassword is not correct",
        });
      const encryptedPassword = encrypt(newPassword);
      dbResponse = await User.findByIdAndUpdate(_id, {
        password: encryptedPassword,
      });
    }

    if (!dbResponse)
      return res.status(402).json({
        success: false,
        message: "some error occured when updating new password",
      });

    return res.status(200).json({
      success: true,
      message: "updated user password",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: "unable to update user password",
      error: error.message,
    });
  }
};
