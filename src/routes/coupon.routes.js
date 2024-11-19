const express = require("express");
const couponController = require("./../controllers/coupon.controller");
const { protect } = require("./../middlewares/protect");
const { restrictTo } = require("./../middlewares/restrictTo");


const router = express.Router();

router.use(protect);
router.post("/add", restrictTo("admin","seller"), couponController.createCoupon);

router.post("/apply", couponController.applyCoupon);

module.exports = router;
