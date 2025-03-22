const router = require("express").Router();

// controllers
const {
  getDetails
} = require("../../controllers/employee/Employee.controller");

// middlewares
const { auth, isEmployee } = require("../../middlewares/auth.middleware");


// employee routes
router.get("/get", auth, isEmployee, getDetails);


module.exports = router;
