const catchAsync = require("./../../utils/catchAsync");
const AppError = require("./../../utils/app.error");

const User = require("./../models/users.model");
const { createSendToken } = require("./../../utils/authentication");
const {
  userDetailsAreValid,
  passwordIsConfirmed,
} = require("./../../utils/validators/user.validator");

exports.signUp = catchAsync(async (req, res, next) => {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    name: req.body.name,
    role: req.body.role,
  };

  if (
    !userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.confirmPassword,
      req.body.name
    ) ||
    !passwordIsConfirmed(req.body.password, req.body.confirmPassword)
  ) {
    return next(new AppError("Please check your inputs again", 400));
  }

  const userExists = await User.findOne({ email: enteredData.email });

  if (userExists) {
    res.status(400);
    return next(new AppError("user already exists", 400));
  }

  const user = await User.create({
    name: enteredData.name,
    email: enteredData.email,
    password: enteredData.password,
    phone: enteredData.phone,
    role: enteredData.role,
  });

  if (user) {
    createSendToken(user, 201, res);
  } else {
    return next(new AppError("invalid user data", 400));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 3 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "You have successfully logged out.",
  });
});
