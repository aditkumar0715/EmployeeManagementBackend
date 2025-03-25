const router = require("express").Router();

const {
  createFeedback,
  getAllFeedbacks,
  getOneFeedback,
  deleteFeedback,
} = require("../controllers/Feedback.controller");
const {
  isEmployer,
  auth,
  isEmployee,
} = require("../middlewares/auth.middleware");

router.post("/create", auth, isEmployee, createFeedback);
router.get("/", auth, isEmployer, getAllFeedbacks);
router.get("/:id", auth, isEmployer, getOneFeedback);
router.delete("/:id", auth, isEmployer, deleteFeedback);

module.exports = router;
