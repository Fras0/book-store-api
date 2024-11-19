const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/app.error");
const Book = require("./../models/books.model");
const Purchase = require("./../models/purchase.model");
const factory = require("./factory.controller");
const path = require("path");
const fs = require("fs");

exports.uploadPDF = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;

  if (!req.file) {
    return next(new AppError("No file uploaded'", 400));
  }

  const pdfUrl = `/uploads/${req.file.filename}`;

  const updatedBook = await Book.findByIdAndUpdate(
    bookId,
    { pdfUrl: pdfUrl },
    { new: true }
  );

  if (!updatedBook) {
    return next(new AppError("Book not found", 404));
  }

  res.status(200).json({
    status: "success",
    book: updatedBook,
    pdfUrl: `${pdfUrl}`,
  });
});

exports.downloadPDF = catchAsync(async (req, res, next) => {
  const book = req.book;

  const pdfPath = path.join(__dirname, "..", book.pdfUrl);

  if (!fs.existsSync(pdfPath)) {
    return next(new AppError("PDF file not found on server", 404));
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=' + path.basename(pdfPath));
  res.sendFile(pdfPath);
});

exports.getBooksBySeller = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const books = await Book.find({ seller: sellerId });

  if (!books.length) {
    return next(new AppError("No books found for this seller", 404));
  }

  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
    },
  });
});

exports.getBooksPurchasedByUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const purchases = await Purchase.find({ userId }).populate({
    path: "bookId",
    select: "name description price pdfUrl seller",
  });

  if (!purchases.length) {
    return next(new AppError("No purchases found for this user", 404));
  }

  const books = purchases.map((purchase) => purchase.bookId);

  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
    },
  });
});

exports.hasAccess = catchAsync(async (req, res, next) => {
  const book = req.book;

  if (book) {
    return res.status(200).json({
      status: "success",
      data: {
        book,
        hasAccess: true,
      },
    });
  }
});

exports.updateSalesCount = catchAsync(async (bookId) => {
  await Book.findByIdAndUpdate(bookId, { $inc: { salesCount: 1 } });
});

exports.getTopSellingBooksByCategory = catchAsync(async (categoryId) => {
  const books = await Book.aggregate([
    { $match: { category: mongoose.Types.ObjectId(categoryId) } },
    { $sort: { salesCount: -1 } },
    { $limit: 10 },
  ]);
  return books;
});

exports.createBook = catchAsync(async (req, res, next) => {
  const new_book = req.body;
  new_book.name = `${new_book.name} - by ${req.user.name}`;
  new_book.seller = req.user.id;
  const doc = await Book.create(new_book);

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.getAllBook = factory.getAll(Book);
exports.getBook = factory.getOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);
