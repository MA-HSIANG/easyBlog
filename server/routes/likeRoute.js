const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const likeController = require("../controller/likeController");

router.route("/blogLikes/:id").get(likeController.getAllBlogLikeDatas);
router
  .route("/:id")
  .get(
    authController.verifyToken,
    authController.verifyRole("user", "admin"),
    likeController.getLikeStatus
  )
  .post(
    authController.verifyToken,
    authController.verifyRole("user", "admin"),
    likeController.updateAndCreateLike
  );

module.exports = router;
