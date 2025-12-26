const express = require("express");
const {isAuthenticated} = require("../middlewares/authMiddleware")
const {
  register,
  verifyOTP,
  login,
  logout,
  getUser
} = require("../controllers/authController");
const router = express.Router();
router.post("/register", register);
router.post("/verify", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated,logout);
router.get("/me", isAuthenticated,getUser);
module.exports = { router };
