const router = require("express").Router();
const Employee = require("../../models/Employee.model");
const populateFields = ["department", "details"];

// controllers
const {
  addEmployee,
  removeEmployee,
  getEmployee,
  getEmployeeById,
  updateEmployee,
} = require("../../controllers/employer/Employee.controller");

// middlewares
const { auth, isEmployer } = require("../../middlewares/auth.middleware");
const { paginate } = require("../../middlewares/paginate.middleware");

// employee routes
router.post("/add", auth, isEmployer, addEmployee);
router.delete("/remove/:empId", auth, isEmployer, removeEmployee);
router.get("/get/:id", auth, isEmployer, getEmployeeById);
router.get(
  "/get",
  auth,
  isEmployer,
  paginate(Employee, populateFields),
  getEmployee
);
router.put("/update/:id", auth, isEmployer, updateEmployee);

module.exports = router;
