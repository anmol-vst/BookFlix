const express = require("express");
const router = express.Router();
const {isAuthenticated,isAuthorised} = require("../middlewares/authMiddleware");
const {getBorrowedBooksForAdmin,borrowedBooks,recordBorrowedBooks,returnBorrowedBooks} = require("../controllers/borrowedBooks")
router.get("/")
router.get("/")
router.get("/")
router.get("/")
module.exports = {router,}
