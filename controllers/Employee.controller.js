const Employee = require("../models/Employee.model");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const Department = require("../models/Department.model");

exports.addEmployee = async (req, res) => {
  try {
    // data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      jobRole,
      department,
      contact = "",
      salary = "",
    } = req.body;

    // validate the data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !jobRole ||
      !department
    ) {
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

    // check if department exists or not
    const departmentData = await Department.findOne({ name: department });
    if (!departmentData) {
      return res.status(400).json({
        success: false,
        message: "department you provided does not exists",
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

    let employee = await Employee.create({
      jobRole,
      department: departmentData._id,
      details: user._id,
      contact,
      salary,
    });

    employee = await Employee.findOne({ _id: employee._id })
      .populate("details")
      .populate("department")
      .exec();

    // remove password hash
    employee.details.password = "removed due to security issues.";

    // return res
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      employee,
    });
  } catch (error) {
    console.log("Error while adding employee", error);
    return res.status(501).json({
      success: false,
      message: "Unable to add employee",
      error: error.message,
    });
  }
};
