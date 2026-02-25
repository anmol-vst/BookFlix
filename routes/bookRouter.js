const { isAuthenticated,isAuthorised } = require("../middlewares/authMiddleware");
const express = require("express");
const {addBook,deleteBook,getAllBooks}= require("../controllers/bookController")
const router = express.Router();
router.post("/admin/add",isAuthenticated,isAuthorised("Admin"),addBook)
router.delete("/delete/:id",isAuthenticated,isAuthorised("Admin"),deleteBook)
router.get("/getBooks",isAuthenticated,getAllBooks)
module.exports = { router };
