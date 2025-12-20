const {app} = require("./app")


app.listen(process.env.PORT,()=>console.log(`running at${process.env.PORT}`))