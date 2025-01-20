const router = require("express").Router();

const { addEmployee } = require("../controllers/Employee.controller");
const { auth, isEmployer } = require("../middlewares/auth.middleware");

router.post("/add", auth, isEmployer, addEmployee);

module.exports = router;
