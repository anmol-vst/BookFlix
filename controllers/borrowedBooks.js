const { Borrow } = require("../models/borrow");
const { User } = require("../models/user");
const { Book } = require("../models/bookModel");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const {
  errorMiddleware,
  ErrorHandler,
} = require("../middlewares/errorMiddleware");
const recordBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("book not found", 400));
  }
  const user = await User.findOne({ email, accountVerified:true });
  if (!user) {
    return next(new ErrorHandler("user not found"), 400);
  }
  if (book.quantity === 0) {
    return next(new ErrorHandler("book is not available", 400));
  }
  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.book_id.toString() === id && b.returned === false,
  );
  if(isAlreadyBorrowed){
  return next (new ErrorHandler("book is already borrowed",400))
}
book.quantity -= 1;
book.available = book.quantity>0;
await book.save();
user.borrowedBooks.push({
  book_id: book._id,
  bookTitle:book.title,
  borrowedDate: new Date(),
  dueDate: new Date(Date.now()*7*24*60*60*1000)
}),
await user.save()
await Borrow.create({user:{
  id:user._id,
  name: user.name,
  email: user.email,

},
price: book.price,
book: book._id,
borrowDate: book.borrowDate,
dueDate: book.dueDate,
})
res.statue(200).json({
  success: true,
  message: " book borrowed"
})
});

const borrowedBooks = catchAsyncErrors(async (req, res, next) => {});
const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {});

module.exports = {
  recordBorrowedBooks,
  borrowedBooks,
  getBorrowedBooksForAdmin,
};
