const router = require("express").Router();

// controllers
const {
  employeeTasks
} = require("../../controllers/employee/Task.controller");

// middlewares
const { auth, isEmployee } = require("../../middlewares/auth.middleware");
// const { paginate } = require("../../middlewares/paginate.middleware");

// employee routes
router.get("/get", auth, isEmployee, employeeTasks);


module.exports = router;
