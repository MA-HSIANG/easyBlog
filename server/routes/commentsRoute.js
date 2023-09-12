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
//驗證是否登入失效
router.use(authController.verifyToken);
router
  .route("/")
  .post(
    authController.verifyRole("admin", "user"),
    commentsController.createComment
  );

module.exports = router;
