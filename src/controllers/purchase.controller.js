const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Purchase = require("../models/purchase.model");
const Book = require("./../models/books.model");
const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/app.error");
const factory = require("./factory.controller");
const bookController = require("./book.controller");
const mongoose = require("mongoose");
const Coupon = require("./../models/coupon.model");

exports.purchaseBook = catchAsync(async (req, res, next) => {
  let discountAmount = 0;
  const { bookId } = req.params;
  const userId = req.user.id;

  const couponCode = req.body.couponCode;
  const coupon = await Coupon.findOne({ code: couponCode, book: bookId });

  const book = await Book.findById(bookId);
  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  const existingPurchase = await Purchase.findOne({ userId, bookId });
  if (existingPurchase) {
    return next(new AppError("You have already purchased this book", 400));
  }

  if (coupon) {
    if (new Date(coupon.expirationDate) < new Date()) {
      return next(new AppError("This coupon has expired", 400));
    }

    discountAmount = (book.price * coupon.discountPercentage) / 100;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round((book.price - discountAmount) * 100),
    currency: "usd",
    metadata: { userId, bookId },
  });

  res.status(200).json({
    status: "success",
    clientSecret: paymentIntent.client_secret,
  });
});

exports.confirmPurchase = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  const price = req.body.price;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { seller } = book;

  if (userId === seller.toString()) {
    return res
      .status(400)
      .json({ message: "You cannot purchase your own book." });
  }

  const existingPurchase = await Purchase.findOne({ userId, bookId });
  if (existingPurchase) {
    return res
      .status(409)
      .json({ message: "You have already purchased this book." });
  }

  const newPurchase = new Purchase({
    userId,
    sellerId: seller,
    bookId,
    price,
  });

  await newPurchase.save();

  return res.status(201).json({
    message: "Purchase confirmed successfully",
    purchase: newPurchase,
  });
});

exports.getSellerPurchaseStats = catchAsync(async (req, res) => {
  const sellerId = req.user._id;

  const purchaseStats = await Purchase.aggregate([
    { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },

    {
      $lookup: {
        from: "books",
        localField: "bookId",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    { $unwind: "$bookDetails" },

    {
      $lookup: {
        from: "categories",
        localField: "bookDetails.category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },

    {
      $group: {
        _id: "$bookDetails.category",
        categoryName: { $first: "$categoryDetails.name" },
        totalPurchases: { $sum: 1 },
        totalAmountSpent: { $sum: "$bookDetails.price" },
      },
    },
    { $sort: { totalAmountSpent: -1 } },
  ]);

  const topSellingBooks = await Purchase.aggregate([
    { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },

    {
      $lookup: {
        from: "books",
        localField: "bookId",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    { $unwind: "$bookDetails" },

    {
      $group: {
        _id: "$bookId",
        title: { $first: "$bookDetails.name" },
        salesCount: { $sum: 1 },
        totalRevenue: { $sum: "$bookDetails.price" },
      },
    },
    { $sort: { salesCount: -1 } },
    { $limit: 3 },
  ]);

  const totalSales = await Purchase.aggregate([
    { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
        totalBooksSold: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      purchaseStats,
      topSellingBooks,
      totalSales: totalSales[0] || { totalRevenue: 0, totalBooksSold: 0 },
    },
  });
});

exports.getAllPurchases = factory.getAll(Purchase);
