const Employee = require("../../models/Employee.model");

exports.getDetails = async (req, res) => {
  try {
    const { _id } = req.user;
    const emp = await Employee.findOne(
      { details: _id },
      { __v: 0, details: 0 }
    ).populate("department");
    if (!emp)
      return res.status(403).json({
        success: false,
        message: "No employee is linked with these details",
      });
    res.status(200).json({
      success: true,
      message: "fetched employee details",
      data: { employee: emp, details: req.user },
    });
  } catch (error) {
    console.log("Error while getting employee details: ", error);
    res.status(500).json({
      success: false,
      messge: "Unable to fetch employee details",
      error: error.message,
    });
  }
};
