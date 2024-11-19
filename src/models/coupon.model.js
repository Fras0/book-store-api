const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
    },

    discountPercentage: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [1, "Discount percentage must be at least 1%"],
      max: [100, "Discount percentage must be at most 100%"],
    },

    book: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: [true, "Coupon must be linked to a book"],
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Coupon must be linked to a seller"],
    },

    expirationDate: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
