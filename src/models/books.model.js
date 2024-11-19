const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Book must have a name!"],
      trim: true,
    },
    description: {
      type: String,
    },

    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Book must have an author!"],
    },
    price: {
      type: Number,
      required: [true, "A book must have a price"],
    },

    priceDiscount: {
      type: Number,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },

    pdfUrl: String,

    salesCount: {
      type: Number,
      default: 0,
    },
    published: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },

  {
    timestamps: true,
  }
);

bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  }).populate({
    path: "seller",
    select: "name email",
  });
  next();
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
