const express = require("express")
const {config}= require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express();

module.exports = app;

config({path:"./config/config.env"})
app.use(cors({origin:[process.env.FRONTEND
    -URL
],
methods:["GET","PUT","POST","DELETE"],
credentials:true}))
app.use(cookieParser)
app.use(express.json());
app.use(express.urlencoded({extended:true}))