const router = require("express").Router();

const { createFeedback, getAllFeedbacks, getOneFeedback } = require("../controllers/Feedback.controller");
const {
  isEmployer,
  auth,
  isEmployee,
} = require("../middlewares/auth.middleware");

router.post("/feedback/create", auth, isEmployee, createFeedback);
router.get("/feedback", auth, isEmployer, getAllFeedbacks);
router.get("/feedback/:id", auth, isEmployer, getOneFeedback);

module.exports = router;
