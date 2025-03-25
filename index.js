//load config from env file
require("dotenv").config();

const express = require("express");
const app = express();

const { dbConnect } = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/User.routes");
const employerDeptRoutes = require("./routes/employer/Department.routes");
const employerEmpRoutes = require("./routes/employer/Employee.routes");
const employerTaskRoutes = require("./routes/employer/Task.routes");
const employeeDetailsRoutes = require("./routes/employee/Employee.routes");
const employeeTaskRoutes = require("./routes/employee/Task.routes");
const feedbackRoutes = require("./routes/Feedback.routes");
const insightRoutes = require("./routes/employer/Insights.routes");

const PORT = process.env.PORT || 5000;

// connect to the database
dbConnect();

// middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/department", employerDeptRoutes);
app.use("/api/v1/employee", employerEmpRoutes);
app.use("/api/v1/task", employerTaskRoutes);
app.use("/api/v1/details", employeeDetailsRoutes);
app.use("/api/v1/empTasks", employeeTaskRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/insights", insightRoutes);
// default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Your server is up and running",
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
