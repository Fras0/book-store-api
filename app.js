const express = require("express");
const morgan = require("morgan");
const errorHandlerMiddleware = require("./utils/error.handler");
const AppError = require("./utils/app.error");

const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: `${process.env.FRONT_END_SERVER}`,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
// routes

const userRouter = require("./src/routes/user.routes");
const categoryRouter = require("./src/routes/category.routes");
const bookRouter = require("./src/routes/book.routes");
const purchaseRoutes = require("./src/routes/purchase.routes");
const couponRoutes = require("./src/routes/coupon.routes");

// middlewares

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour",
// });
// app.use("/api", limiter);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use(morgan("dev"));
app.use(cookieParser());
app.use("/uploads", express.static("./src/uploads"));

app.use("/api/v1/users/", userRouter);
app.use("/api/v1/categories/", categoryRouter);
app.use("/api/v1/books/", bookRouter);
app.use("/api/v1/purchase/", purchaseRoutes);
app.use("/api/v1/coupons/", couponRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandlerMiddleware);

module.exports = app;
