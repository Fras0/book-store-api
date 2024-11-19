const Book = require("../models/books.model");
const Purchase = require("../models/purchase.model");
const AppError = require("../../utils/app.error");

const checkOwnershipOrPurchase = async (req, res, next) => {
  const userId = req.user._id.toString();
  const bookId = req.params.id;


  const book = await Book.findById(bookId);
  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  const hasPurchased = await Purchase.exists({ userId, bookId });

  if (book.seller._id.toString() === userId || hasPurchased) {
    req.book = book;
    return next();
  } else {
    return next(new AppError("You do not have access to this book", 403));
  }
};

module.exports = checkOwnershipOrPurchase;
