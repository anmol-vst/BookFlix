const mongoose = require("mongoose");
const { options } = require("../app");
async function connectToMongoDb() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to database");
}
module.exports = { connectToMongoDb };
