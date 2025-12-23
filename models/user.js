const mongoose = require("mongoose");
const { parse } = require("path");
const jwt =  require("jsonwebtoken")
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
      // enum: [client, Admin],
      // default: client,
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    borrowedBooks: [
      {
        book_id: {
          type: mongoose.Schema.Types.ObjectId,
          // ref: borrow,
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

userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const RemainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, 0);
    return parseInt(firstDigit + RemainingDigits);
  }
  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 5 * 60 * 1000;
  return verificationCode;
};

userSchema.methods.generateToken= function() {
  return jwt.sign({id: this._id},
    process.env.JWT_SECRET_KEY,{
      expiresIn: process.env.JWT_EXPIRE, 
    }
  )
}
const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};
