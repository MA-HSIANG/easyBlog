const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const categoryController = require("../controller/categoryController");

router
  .route("/")
  .get(categoryController.getAllCategorys)
  .post(
    authController.verifyToken,
    authController.verifyRole("admin"),
    categoryController.postCategory
  );
//驗證是否登入失效
router.use(authController.verifyToken);
router
  .route("/:id")
  .put(authController.verifyRole("admin"), categoryController.putCategory)
  .delete(authController.verifyRole("admin"), categoryController.delCategory);

module.exports = router;
