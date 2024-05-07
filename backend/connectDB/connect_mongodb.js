const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// connect to mongodb
const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");
};
connectToMongo();

module.exports = connectToMongo;