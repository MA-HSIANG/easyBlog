const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const commentsController = require("../controller/commentsController");

router
  .route("/:id")
  .get(
    commentsController.findAllBlogCommentData,
    commentsController.getBlogComments
  );
router
  .route("/reply/:id")
  .get(
    commentsController.findAllBlogCommentData,
    commentsController.getBlogReply
  );
//驗證是否登入失效
router.use(authController.verifyToken);
router
  .route("/")
  .post(
    authController.verifyRole("admin", "user"),
    commentsController.createComment
  );
router
  .route("/reply")
  .post(
    authController.verifyRole("admin", "user"),
    commentsController.createReply
  );
module.exports = router;
