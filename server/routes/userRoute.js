const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const userController = require("../controller/userController");

//user註冊
router.route("/resgist").post(authController.resgist);
//登入
router.route("/login").post(authController.login);

//驗證是否登入失效
router.use(authController.verifyToken);
//驗證客戶端
router
  .route("/verifyToken")
  .get(
    authController.verifyRole("user", "admin"),
    authController.loginVerified
  );
//判定進入的人員
router.route("/verifyId").get(authController.toWhere);
router
  .route("/")
  .get(authController.verifyRole("admin"), userController.getAllUser);
router
  .route("/updateRole")
  .get(authController.verifyRole("admin"), authController.getRoleSelect)
  .patch(authController.verifyRole("admin"), authController.updateRole);
router
  .route("/isUser")
  .get(
    authController.verifyRole("user", "admin"),
    userController.gatAllUserLikeBlogData
  )
  .post(authController.verifyRole("user", "admin"), userController.uploadAvatar)
  .patch(authController.verifyRole("user", "admin"), userController.patchUser);
module.exports = router;
