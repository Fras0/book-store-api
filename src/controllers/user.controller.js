const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/app.error");
const User = require("./../models/users.model");
const factory = require("./factory.controller");

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUserSalesSummary = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .populate("purchased_books.bookId")
    .exec();

  const totalSales = user.purchased_books.reduce(
    (sum, purchase) => sum + purchase.price,
    0
  );

  res.status(200).json({
    status: "success",
    data: {
      balance: user.balance,
      totalSales,
      mostSoldBooks: await getTopSellingBooksByCategory(userId),
    },
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
