const router = require("express").Router();

const { login, signup, logout, getUserDetails, updateUserDetails } = require("../controllers/Auth.controller");

const { auth } = require("../middlewares/auth.middleware");

// Routes for login, signup and Authentication

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/mydetails", auth, getUserDetails);
router.put("/update", auth, updateUserDetails);

module.exports = router;
