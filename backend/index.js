const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
// connect to databases
const mongodb = require("./connectDB/connect_mongodb");
const mysql = require("./connectDB/connect_mysql");
const redis = require("./connectDB/connect_redis");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/messages", messageRoute);

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
