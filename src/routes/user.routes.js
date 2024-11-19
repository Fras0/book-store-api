const express = require("express");
const userController = require("./../controllers/user.controller");
const authController = require("./../controllers/auth.controller");
const { protect } = require("./../middlewares/protect");
const { restrictTo } = require("./../middlewares/restrictTo");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.use(protect);

router.get("/myProfile", userController.getMe, userController.getUser);

// routes only accessed by admin
router.use(restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
