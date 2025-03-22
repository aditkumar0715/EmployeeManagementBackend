const express = require("express");
const app = express();

const { dbConnect } = require("./config/database");
const { connectCloudinary } = require("./config/cloudinary");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/User.routes");
const employerDeptRoutes = require("./routes/employer/Department.routes");
const employerEmpRoutes = require("./routes/employer/Employee.routes");
const employerTaskRoutes = require("./routes/employer/Task.routes");
const employeeDetailsRoutes = require("./routes/employee/Employee.routes");
const employeeTasks = require("./routes/employee/Task.routes");

//load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// connect to the database
dbConnect();

// connect to cloudinary
connectCloudinary();

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
app.use("/api/v1/empTasks", employeeTasks);

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
