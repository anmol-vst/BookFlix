const { sendVerificationCode } = require("../utils/sendVerificationCode");
const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const register = async (req, res, next) => {
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
    const hashpassword = await bcrypt.hash(password, 5);
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
};
const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(new ErrorHandler("Email or otp is missing", 400));
  }
  try {
    const userEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });
    if (!userEntries) {
      return next(new ErrorHandler("not found", 404));
    }
    let user;
    if (userEntries.length > 1) {
      user = userEntries[0];
      await User.deleteMany({
        _id: { $ne: user_id },
        email,
        accountVerified: false,
      });
    }
    if(verificationCode!==Number(otp)){
      return next (new ErrorHandler("invalid Otp",400))
    }
    const currentTime = Date.now();
   const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime()
   if(currentTime>verificationCodeExpire){
   return next(new ErrorHandler("otp Expired",400))
   }
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({validateModifiedOnly:true})
    sendToken(user,200,"Account Verified",res)
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
});
module.exports = { register };
