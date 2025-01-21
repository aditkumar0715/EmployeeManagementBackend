const router = require("express").Router();

const {
  createTask,
  getTaskById,
  getAllTasks,
} = require("../controllers/Task.controller");
const { auth, isEmployer } = require("../middlewares/auth.middleware");

router.post("/create", auth, isEmployer, createTask);
router.get("/get/:taskId", auth, isEmployer, getTaskById);
router.get("/all", auth, isEmployer, getAllTasks);

module.exports = router;
