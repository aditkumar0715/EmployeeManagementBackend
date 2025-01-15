const router = require("express").Router();

const {login, signup} = require("../controllers/Auth.controller");


const {auth} = require("../middlewares/auth");

// Routes for login, signup and Authentication


router.post("/login", login);
router.post("/signup", signup);



module.exports = router;