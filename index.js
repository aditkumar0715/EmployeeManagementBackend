const express = require("express");
const app = express();

const { dbConnect } = require("./config/database");
const { connectCloudinary } = require("./config/cloudinary");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/User.routes");
const departmentRoutes = require("./routes/Department.routes");
const employeeRoutes = require("./routes/Employee.routes");
const taskRoutes = require("./routes/Task.routes");

//load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// connect to the database
dbConnect();

// connect to cloudinary
connectCloudinary();

// middlewares
app.use(express.json());
app.use(express.static("public"))
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/task", taskRoutes);

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
