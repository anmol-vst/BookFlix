const express = require("express")
const {register,verifyOTP} = require("../controllers/authController")
const router = express.Router();
router.post("/register",register)
router.post("/verify",verifyOTP)
module.exports= {router}