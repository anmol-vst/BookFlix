
const {sendVerificationCode} = require("../utils/sendVerificationCode")
const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {ErrorHandler} = require("../middlewares/errorMiddleware");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
 const  register =(async (req,res,next) => {
  try {
    const { name, email, password } = req.body;
   
    if (!name || !email || !password) {
      return next(new ErrorHandler("please fill all fields", 400));
    }
    const ifRegistered = await User.findOne({ email, accountVerified: true });
    if (ifRegistered) {
   
      return next(new ErrorHandler("user already exist", 400));

    }
    const registrationAttemptByUser = await User.find({
      email,
      accountVerified: false,
    });
    if (registrationAttemptByUser.length > 5) {
      return next(
        new ErrorHandler(
          "you have exceeded the max no of registration attempts. Please contact support",
          400
        )
      );
    }
  
    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler("Password must be between 8 to 16 characters", 400)
      );
    }
    const hashpassword = await bcrypt.hash(password,5);
    const user = await User.create({
      name,
      email,
      password: hashpassword,
    });
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(verificationCode, email, res);
  } catch (error) {

    next(error);
  }
});
module.exports = {register}