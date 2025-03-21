const router = require("express").Router();
const Department = require("../../models/Department.model");

const {
  createDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("../../controllers/employer/Department.controller");

const { auth, isEmployer } = require("../../middlewares/auth.middleware");
const { paginate } = require("../../middlewares/paginate.middleware");

router.post("/create", auth, isEmployer, createDepartment);
router.get("/get/:id", auth, isEmployer, getDepartmentById);
router.get("/get", auth, isEmployer, paginate(Department), getDepartments);
router.put("/update/:id", auth, isEmployer, updateDepartment);
router.delete("/delete/:id", auth, isEmployer, deleteDepartment);

module.exports = router;
