const router = require("express").Router();

const { login, signup, logout } = require("../../controllers/Auth.controller");

const { auth } = require("../../middlewares/auth.middleware");

// Routes for login, signup and Authentication

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);

module.exports = router;
