const Task = require("../../models/Task.model");
const Employee = require("../../models/Employee.model");
const mongoose = require("mongoose");

exports.createTask = async (req, res) => {
  try {
    const {
      taskId,
      title,
      description = "",
      priority = "Mid",
      status = "Pending",
      assignedTo,
    } = req.body;

    if (!title || !taskId || !assignedTo) {
      return res.status(401).json({
        success: false,
        message: "Fill all the required fields",
      });
    }

    // validate userId
    let employeeId = undefined;
    try {
      employeeId = new mongoose.Types.ObjectId(assignedTo);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Employee Id",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Employee id did not match. cannot assign task",
      });
    }

    const createdTask = await Task.create({
      taskId,
      title,
      description,
      priority,
      status,
      assignedTo,
    });
    res.status(200).json({
      success: true,
      message: "task created successfully",
      createdTask,
    });
  } catch (error) {
    console.log("Error while creating task", error);
    res.status(501).json({
      success: false,
      message: "Unable to create task",
      error: error,
    });
  }
};

exports.updateTask = async (req, res) => {
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

    // validate taskId
    let taskID = undefined;
    try {
      taskID = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid task Id",
      });
    }

    // get name and description
    const {
      taskId,
      title,
      description = "",
      priority = "Mid",
      status = "Pending",
      assignedTo,
    } = req.body;

    // validation
    if (!title || !taskId || !assignedTo) {
      return res.status(401).json({
        success: false,
        message: "Fill all the required fields",
      });
    }

    // validate employeeId
    let employeeId = undefined;
    try {
      employeeId = new mongoose.Types.ObjectId(assignedTo);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Employee Id",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Employee id did not match. cannot assign task",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskID },
      {
        taskId,
        title,
        description,
        priority,
        status,
        assignedTo,
      }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Unable to update the task",
      error: error,
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "id not found",
      });
    }
    // validate taskId
    let taskId = undefined;
    try {
      taskId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid task Id",
      });
    }
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(401).json({
        success: false,
        message: "task with given id not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "task fetched successfully",
      data: task,
    });
  } catch (error) {
    console.log("Error while fetching task by id", error);
    res.status(501).json({
      success: false,
      message: "Unable to fetch task with given id",
      error: error,
    });
  }
};

exports.getTasks = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "fetched departments",
    data: res.paginatedResult,
  });
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "id not found",
      });
    }

    // validate taskId
    let taskId = undefined;
    try {
      taskId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid task Id",
      });
    }
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(401).json({
        success: false,
        message: "Task with given id not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      deletedTask,
    });
  } catch (error) {
    console.log("Error while deleting task", error);
    res.status(501).json({
      success: false,
      message: "Unable to delete task",
      error: error,
    });
  }
};
