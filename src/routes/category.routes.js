const express = require("express");
const categoryController = require("./../controllers/category.controller");
const { protect } = require("./../middlewares/protect");
const { restrictTo } = require("./../middlewares/restrictTo");

const router = express.Router();

router.use(protect);

router.use(restrictTo("admin", "seller"));

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
