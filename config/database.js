const mongoose = require("mongoose");
const constants = require("../constants.js")
require("dotenv").config();

exports.dbConnect = () => {
  mongoose
    .connect(`${process.env.DB_URI}/${constants.DB_NAME}`)
    .then(() => console.log("Db Connection successful"))
    .catch((error) => {
      console.log("Db connection failed");
      console.error(error);
      process.exit(1);
    });
};
