const Coupon = require("./../models/coupon.model");
const AppError = require("./../../utils/app.error");
const catchAsync = require("./../../utils/catchAsync");
const Book = require("./../models/books.model");

exports.createCoupon = catchAsync(async (req, res, next) => {
  const { code, discountPercentage, bookId, expirationDate, sellerId } =
    req.body;

  if (new Date(expirationDate) < new Date()) {
    return next(new AppError("Expiration date must be in the future.", 400));
  }

  const coupon = await Coupon.create({
    code,
    discountPercentage,
    book: bookId,
    expirationDate,
    seller: sellerId,
  });

  res.status(201).json({
    status: "success",
    data: { coupon },
  });
});

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { bookId, couponCode } = req.body;

  const coupon = await Coupon.findOne({ code: couponCode, book: bookId });

  if (!coupon) {
    return next(
      new AppError(
        "Invalid coupon code or coupon does not apply to this book",
        400
      )
    );
  }

  if (new Date(coupon.expirationDate) < new Date()) {
    return next(new AppError("This coupon has expired", 400));
  }

  const book = await Book.findById(bookId);
  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  const discountAmount = (book.price * coupon.discountPercentage) / 100;
  const discountedPrice = book.price - discountAmount;

  res.status(200).json({
    status: "success",
    data: { discountedPrice },
  });
});
