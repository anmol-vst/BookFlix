const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const { Book } = require("../models/bookModel");
const { User } = require("../models/user");
const { ErrorHandler } = require("../middlewares/errorMiddleware");

const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.params;
  if (title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("all fields are required", 400));
  }
  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
  });
  res.status(200).json({
    success: true,
    message: "book added successfully",
    book,
  });
});
const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("book does not exist", 400));
  }
  await book.deleteOne();
  res.status(200).json({
    success:true,
    message:"book deleted successfully"
  })
});
const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = Book.find();
  res.status(200).json({
    success: true,
    books,
  });
});

module.exports = { addBook, deleteBook, getAllBooks };
