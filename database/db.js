const mongoose  = require("mongoose");
const { options } = require("../app");
function connectToMongoDb (){
    mongoose.connect(process.env.MONGO_URI,{
        dbName:BookLibrary,ls 
    })
}
moudule.exports = {connectToMongoDb}