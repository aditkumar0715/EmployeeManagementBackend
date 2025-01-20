const Department = require("../models/Department.model");

// create department controller
exports.createDepartment = async (req, res) => {
  try {
    // get name and description of the department
    const { name, description = "" } = req.body;
    // validation
    if (!name) {
      res.status(401).json({
        success: false,
        message: "name is a required",
      });
    }
    // create department in database
    const department = await Department.create({ name, description });
    // console.log(department);
    // send response
    res.status(200).json({
      success: true,
      message: "department created successfully",
      data: department,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Unable to create department please try again",
      error: error.message,
    });
  }
};

// delete department controller
exports.deleteDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(401).json({
        success: false,
        message: "id not found",
      });
    }
    const deletedDepartment = await Department.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Department deletion successful",
      deleted: deletedDepartment,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Unable to delete department please try again later",
      error: error.message,
    });
  }
};

// get department by id controller
exports.getDepartmentById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(401).json({
        success: false,
        message: "id not found",
      });
    }
    const department = await Department.findById(id);
    res.status(200).json({
      success: true,
      message: "fetched department details",
      data: department,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Unable to get department details please try again",
      error: error.message,
    });
  }
};

// update department controller
exports.updateDepartment = async (req, res) => {
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
    const { name, description = "" } = req.body;
    // console.log("Got name and description: \n", name, description);
    // validate name
    if (!name) {
      res.status(401).json({
        success: false,
        message: "name is required",
      });
    }
    // update data in database
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      updatedData: updatedDepartment,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Unable to update the department",
      error: error.message,
    });
  }
};

// get all department controller
exports.getAllDepartments = async (req, res) => {
  try {
    const department = await Department.find({});
    res.status(200).json({
      success: true,
      message: "fetched all departments",
      data: department,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Unable to get departments",
      error: error.message,
    });
  }
};
