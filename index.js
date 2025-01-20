const express = require("express");
const app = express();

const { dbConnect } = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/User.routes");
const departmentRoutes = require("./routes/Department.routes");
const employeeRoutes = require("./routes/Employee.routes");

//load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// connect to the database
dbConnect();

// middlewares
app.use(express.json());
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
