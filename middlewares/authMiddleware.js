const { catchAsyncErrors } = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { ErrorHandler } = require("./errorMiddleware");
const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.token;
  if (!token) {
    return next(new ErrorHandler("invalid user", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
});
module.exports = { isAuthenticated };
