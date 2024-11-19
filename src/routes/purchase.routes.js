const express = require("express");
const purchaseController = require("../controllers/purchase.controller");
const { protect } = require("../middlewares/protect");
const { restrictTo } = require("./../middlewares/restrictTo");

const router = express.Router();

router.use(protect);

router.get("/", purchaseController.getAllPurchases);
router.post("/:bookId", purchaseController.purchaseBook);
router.post("/:bookId/confirm", purchaseController.confirmPurchase);

router.use(restrictTo("admin", "seller"));
router.get("/stats/", purchaseController.getSellerPurchaseStats);

module.exports = router;
