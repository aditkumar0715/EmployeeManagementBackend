const Employee = require("../models/Employee.model");
const User = require("../models/User.model");
// const bcrypt = require("bcrypt");
const Department = require("../models/Department.model");
const { encrypt, decrypt } = require("../utils/encrypt");


exports.addEmployee = async (req, res) => {
  try {
    // data fetch from request body
    const {
      employeeId,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType = "Employee",
      jobRole,
      department,
      contact = "",
      salary = "",
    } = req.body;

    // validate the data
    if (
      !employeeId||
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
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = encrypt(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
    });

    let employee = await Employee.create({
      employeeId,
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

exports.updateEmployee = async (req, res) => {
  try {
    // get id from params
    const id = req.params.id;
    // validate id
    if (!id) {
      res.status(401).json({
        success: false,
        message: "id not found",
      });
    }
    // get name and description
    const {
      firstName,
      lastName,
      email,
      jobRole,
      department,
      contact,
      salary,
      profileImg,
    } = req.body;

    // validation
    if (!firstName || !lastName || !email || !jobRole || !department) {
      res.status(401).json({
        success: false,
        message: "Fill all the required fields",
      });
    }

    // get employee
    const employee = await Employee.findById(id);
    // console.log(employee);

    // update data in database


    // update details
    const updatedDetails = await User.findByIdAndUpdate(
      employee.details,
      { firstName, lastName, email, profileImg },
      { new: true }
    );
    
    // update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        jobRole,
        department,
        contact,
        salary,
      },
      { new: true }
    )
      .populate("details")
      .populate("department")
      .exec();
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      updatedData: updatedEmployee,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Unable to update the employee",
      error: error.message,
    });
  }
};

exports.removeEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    if (!empId) {
      return res.status(401).json({
        success: false,
        message: "id not found in params",
      });
    }

    // fetch employee from db
    const employee = await Employee.findById(empId)
      .populate("details")
      .populate("department")
      .exec();

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "employ with this id does not exist",
      });
    }

    // find Object id of user
    const details = employee?.details?._id.toString();
    // delete the user
    const user = await User.findByIdAndDelete(details);
    console.log("user deleted: ", user);
    //TODO delete all of the tasks

    // delete the employee
    const employeeDel = await Employee.findByIdAndDelete(empId);
    console.log("employee deleted: ", employeeDel);

    return res.status(200).json({
      success: true,
      message: "employee removed successfully",
      removedEmployee: employee,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Unable to remove Employee",
      error: error.message,
    });
  }
};

exports.getEmployee = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "fetched employees",
    data: res.paginatedResult,
  });
};

exports.getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(401).json({
        success: false,
        message: "id not found",
      });
    }
    const employee = await Employee.findById(id)
      .populate("department")
      .populate("details")
      .exec();
    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "employee with given id does not exists",
      });
    }

    employee.details.password = decrypt(employee.details.password);
    
    res.status(200).json({
      success: true,
      message: "fetched employee details",
      data: employee,
    });
  } catch (error) {
    console.log("Error while fetching employee by id", error);
    res.status(501).json({
      success: false,
      message: "Unable to get emplyee details please try again",
      error: error.message,
    });
  }
};
