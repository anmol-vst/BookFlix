const app = require("./app")
const mongoose= require("mongoose")
mongoose.connect(process.env.MONGO_URI).then(console.log("connected"))

app.listen(process.env.PORT,()=>console.log(`running at${process.env.PORT}`))