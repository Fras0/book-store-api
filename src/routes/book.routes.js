const express = require("express");
const bookController = require("./../controllers/book.controller");
const { protect } = require("./../middlewares/protect");
const { restrictTo } = require("./../middlewares/restrictTo");
const checkOwnershipOrPurchase = require("../middlewares/checkOwnershipOrPurchase");

const { upload } = require("../../utils/multer");

const router = express.Router();

router.route("/").get(bookController.getAllBook);
router.route("/:id").get(bookController.getBook);

router.use(protect);

router
  .route("/:id/hasAccess")
  .get(checkOwnershipOrPurchase, bookController.hasAccess);

router.get("/seller/:sellerId", bookController.getBooksBySeller);
router.get("/purchased/:userId", bookController.getBooksPurchasedByUser);

router
  .route("/:id/download")
  .get(checkOwnershipOrPurchase, bookController.downloadPDF);

router.use(restrictTo("admin", "seller"));

router.route("/").post(bookController.createBook);

router
  .route("/:id")
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

router
  .route("/:id/upload")
  .post(upload.single("pdf"), bookController.uploadPDF);

module.exports = router;
