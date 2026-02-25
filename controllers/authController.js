const { sendVerificationCode } = require("../utils/sendVerificationCode");
const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { ErrorHandler } = require("../middlewares/errorMiddleware");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const { sendToken } = require("../utils/sendToken");
const { sendEmail } = require("../utils/sendEmail");
const {
  generateVerifictionEmailTemplate,
} = require("../utils/emailVerification");

const register = catchAsyncErrors(async (req, res, next) => {
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
          400,
        ),
      );
    }

    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler("Password must be between 8 to 16 characters", 400),
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
    return next(new ErrorHandler("internal ser", 500));
  }
});
const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(new ErrorHandler("Email or otp is missing", 400));
  }
  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });
    if (!userAllEntries) {
      return next(new ErrorHandler("not found", 404));
    }
    let user;
    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }
    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("invalid Otp", 400));
    }
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire,
    ).getTime();
    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("otp Expired", 400));
    }
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });
    sendToken(user, 200, "Account Verified", res);
  } catch (error) {
    return next(new ErrorHandler("Internal serve error", 500));
  }
});
const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("enter all fields", 400));
  }
  const user = User.findOne({
    email,
    accountVerified: true,
  }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid email or password", 400));
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid emailor password", 400));
  }
  sendToken(user, 200, "login success", res);
});
const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", { expire: new Date(Date.now()), httpOnly: true })
    .json({
      suucess: true,
      message: "logged out successfully",
    });
});
const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  if (!user) {
    return next(new ErrorHandler("invalid user", 400));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generateVerifictionEmailTemplate(resetPasswordURL);
  try {
    await sendEmail({
      email: user.email,
      subject: "password recovery",
      message: message,
    });
    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await user.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("reset password token expired or invalid", 400),
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password did not match", 400));
  }
  if (req.body.password.length < 8 || req.body.password.length > 16) {
    return next(new ErrorHandler("password length must be between 8-16", 400));
  }
  const hashedPassword = bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.resetPassword = undefined;
  user.resetPasswordExpired = undefined;
  await user.save();
  sendToken(user, 200, "password reset successfull.", res);
});
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("provide all passwords", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("new and confirm password do not match", 400));
  }
  if (newPassword.length < 8 || newPassword.length > 16) {
    return next(new ErrorHandler("enter valid password"), 400);
  }
  const isPasswordMatched = bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("current npassword is incorrect.", 400));
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "password updated",
  });
});
module.exports = {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  updatePassword,
};
