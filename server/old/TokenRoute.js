const express = require("express");
const router = express.Router();
const { verifyLogin } = require("../config/Dbutils");
router.post("/checkToken", async (req, res) => {
  const token = req.body.token;

  const isLogin = await verifyLogin(token, "admin");
  if (!isLogin.status) {
    res.send({
      code: 403,
      msg: "帳號失效",
    });
    return;
  } else {
    res.send({
      code: 200,
      msg: "驗證成功",
    });
  }
});

router.post("/checkTokenUser", async (req, res) => {
  const token = req.body.token;
  const isLogin = await verifyLogin(token, "user");
  if (!isLogin.status) {
    res.send({
      code: 403,
      msg: "帳號失效",
    });
    return;
  } else {
    res.send({
      code: 200,
      msg: "驗證成功",
    });
  }
});
module.exports = router;
