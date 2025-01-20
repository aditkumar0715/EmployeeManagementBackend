const router = require("express").Router();

const {
  addEmployee,
  removeEmployee,
  getAllEmployee,
} = require("../controllers/Employee.controller");
const { auth, isEmployer } = require("../middlewares/auth.middleware");

router.post("/add", auth, isEmployer, addEmployee);
router.delete("/remove/:empId", auth, isEmployer, removeEmployee);
router.get("/all", auth, isEmployer, getAllEmployee);

module.exports = router;
