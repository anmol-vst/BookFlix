const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [User, Admin],
      default: User,
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    borrowedBooks: [
      {
        book_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: borrow,
        },
        returned: {
          type: Boolean,
          default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
      },
    ],
    avatar: {
      public_id: String,
      url: String,
    },
    verificationCode: {
      type: Number,
    },
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpired: Date,
  },
  { timestamps: true }
);

 const User = mongoose.model("User", userSchema);
 module.exports={
    User
 }

