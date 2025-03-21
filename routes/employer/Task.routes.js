const router = require("express").Router();
const Task = require("../../models/Task.model");
const populateFields = {
  path: "assignedTo",
  populate: {
    path: "department details",
    select: "-password -createdAt -updatedAt",
  },
};

const {
  createTask,
  getTaskById,
  getTasks,
  deleteTask,
  updateTask,
} = require("../../controllers/employer/Task.controller");
const { auth, isEmployer } = require("../../middlewares/auth.middleware");
const { paginate } = require("../../middlewares/paginate.middleware");

router.post("/create", auth, isEmployer, createTask);
router.get("/get/:id", auth, isEmployer, getTaskById);
router.get("/get", auth, isEmployer, paginate(Task, populateFields), getTasks);
router.delete("/delete/:id", auth, isEmployer, deleteTask);
router.put("/update/:id", auth, isEmployer, updateTask);

module.exports = router;
