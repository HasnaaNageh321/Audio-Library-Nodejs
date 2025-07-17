const express = require("express");
const ConnectDB = require("./config/db");
const  authRouter = require("./routes/auth.Routes");
const authProfile = require("./routes/profile.Routes")
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/api", authProfile);
ConnectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server Running On port ${process.env.PORT}`);
});
