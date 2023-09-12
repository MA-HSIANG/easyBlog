const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const blogController = require("../controller/blogController");
router.route("/new_3_blog").get(blogController.get_new3_blog);
router.route("/get_top3_blog").get(blogController.get_top3_blog);
//判定進入的人員
router.route("/verifyId").get(authController.toWhere);
router.route("/uploadImage").post(userController.uploadImage);
//看板數據
router
  .route("/webAllDatas")
  .get(
    authController.verifyToken,
    authController.verifyRole("admin"),
    blogController.getAllWebDatas
  );
router
  .route("/")
  .get(blogController.getAllSearchBlogs)
  .post(
    authController.verifyToken,
    authController.verifyRole("admin"),
    blogController.postBlog
  );

router
  .route("/:id")
  .get(blogController.getBlog)
  .put(
    authController.verifyToken,
    authController.verifyRole("admin"),
    blogController.putBlog
  )
  .patch(
    authController.verifyToken,
    authController.verifyRole("admin"),
    blogController.delBlog
  );
module.exports = router;
