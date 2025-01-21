const Task = require("../models/Task.model");
const Employee = require("../models/Task.model");
const mongoose = require("mongoose");

exports.createTask = async (req, res) => {
  try {
    const { title, description, isDone = false, assignedTo } = req.body;
    if (!title || !description) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    // TODO: fix the below code, if user sends some random string as id in params catch block is executed.
    // if (assignedTo) {
    //   const employee = await Employee.findById(assignedTo);
    //   if (!employee) {
    //     return res.status(401).json({
    //       success: false,
    //       message: "Employee id did not match. cannot assign task",
    //     });
    //   }
    // }

    const createdTask = await Task.create({
      title,
      description,
      isDone,
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

exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    if (!taskId) {
      return res.status(401).json({
        success: false,
        message: "taskId not found",
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

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({
      success: true,
      message: "fetched all tasks",
      data: tasks,
    });
  } catch (error) {
    console.log("Error while fetching all tasks", error);
    res.status(501).json({
      success: false,
      message: "Unable to fetch all tasks",
      error: error,
    });
  }
};

exports.deleteTask = async (req, res) => {};
