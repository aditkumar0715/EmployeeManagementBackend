const router = require("express").Router();

const { auth, isEmployer } = require("../../middlewares/auth.middleware");
const {
  getInsights,
} = require("../../controllers/employer/Insights.controller");

// router.get("/", auth, isEmployer, getInsights);
router.get("/", auth, isEmployer, getInsights);

module.exports = router;
