const mongoose = require("mongoose");
const borrowSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Book",
    },
    borrowDate: {
      type: Date,
      default: Date.now(),
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
      default: null,
    },
    fine: {
      type: Number,
      default: 0,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const Borrow = mongoose.model("Borrow", borrowSchema);
module.exports = { Borrow };
