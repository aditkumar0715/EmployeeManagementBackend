const router = require("express").Router();

const {login, signup, sendOtp, changePassword} = require("../controllers/Auth.controller");

const {resetPassword, resetPasswordToken} = require("../controllers/ResetPassword.controller");
const {auth} = require("../middlewares/auth");

// Routes for login, signup and Authentication


router.post("/login", login);
router.post("/signup", signup);
router.post("/changepassword",auth, changePassword);


module.exports = router;