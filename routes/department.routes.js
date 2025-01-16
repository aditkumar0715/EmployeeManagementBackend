const router = require("express").Router();

const {
  createDepartment,
  getDepartmentById,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/Department.controller");
const { auth, isEmployer } = require("../middlewares/auth.middleware");

router.post("/create", auth, isEmployer, createDepartment);
router.get("/get/:id", auth, isEmployer, getDepartmentById);
router.get("/all", auth, isEmployer, getAllDepartments);
router.put("/update/:id", auth, isEmployer, updateDepartment)
router.delete("/delete/:id", auth, isEmployer, deleteDepartment);

module.exports = router;
