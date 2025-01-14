const router = require("express").Router();

const {updateProfile, deleteAccount, getAllUserDetails} = require("../controllers/Profile.controller");
const {auth} = require("../middlewares/auth");

router.post("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);




module.exports = router;