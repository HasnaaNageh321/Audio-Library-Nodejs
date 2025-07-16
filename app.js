const express = require("express");
const ConnectDB = require("./config/db");
const app = express();
require("dotenv").config();

ConnectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server Running On port ${process.env.PORT}`);
});
