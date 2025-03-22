const Employee = require("../../models/Employee.model");
const Task = require("../../models/Task.model");

exports.employeeTasks = async (req, res) => {
  try {
    const { _id } = req.user;
    // get employee id
    const emp = await Employee.findOne({ details: _id }, { _id: 1 });
    if (!emp)
      return res.status(403).json({
        success: false,
        message: "No employee is linked with these details",
      });

    const empTasks = await Task.find({ assignedTo: emp._id });
    if (!empTasks)
      return res.status(404).json({
        success: false,
        message: "no tasks found",
      });

    res.status(200).json({
      success: true,
      message: "fetched employee details",
      data: { tasks: empTasks },
    });
  } catch (error) {
    console.log("Error while getting employee details: ", error);
    res.status(500).json({
      success: false,
      messge: "Unable to fetch employee tasks",
      error: error.message,
    });
  }
};
