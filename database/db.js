const mongoose  = require("mongoose");
const { options } = require("../app");
async function connectToMongoDb (){
   await mongoose.connect(process.env.MONGO_URI)
}
module.exports = {connectToMongoDb}