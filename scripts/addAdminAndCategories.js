const mongoose = require("mongoose");
const User = require("./../src/models/users.model");
const Category = require("./../src/models/category.model");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    let admin = await User.findOne({ email: "admin@email.com" });

    if (!admin) {
      
      admin = new User({
        name: "admin",
        email: "admin@email.com",
        password: "12345",
        confirmPassword: "12345",
        role: "admin",
      });
      await admin.save();
      console.log(
        `Admin user created with email ${admin.email} password 12345`
      );
    } else {
      console.log(
        `Admin user already exists with email ${admin.email} password 12345`
      );
    }

    const categories = ["fantasy", "horror", "adventure"];
    for (const categoryName of categories) {
      let category = await Category.findOne({ name: categoryName });
      if (!category) {
        category = new Category({ name: categoryName });
        await category.save();
        console.log(`Category "${categoryName}" created`);
      } else {
        console.log(`Category "${categoryName}" already exists`);
      }
    }

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
    mongoose.disconnect();
  });
