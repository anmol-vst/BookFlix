const express = require("express");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  updatePassword
} = require("../controllers/authController");
const router = express.Router();
router.post("/register", register);
router.post("/verify", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update",isAuthenticated,updatePassword)
module.exports = { router };
