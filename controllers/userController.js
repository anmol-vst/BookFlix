const { ErrorHandler } = require("../middlewares/errorMiddleware");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const { User } = require("../models/user");

const showUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  if (!users) {
    return next(new ErrorHandler("no users available", 400));
  }
  res.status(200).json({
    success: true,
    users,
  });
});

const registerAdmin = catchAsyncErrors(async(req,res,next)=>{
    
})