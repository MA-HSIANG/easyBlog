const express = require("express");
const router = express.Router();
const { genid } = require("../utils/Dbutils");
const authController = require("../controller/authController");
//登入
router.post("/checkLogin", async (req, res) => {
  const options = {
    account: req.body.account,
    password: req.body.password,
    email: req.body.email,
  };

  const data = await userLogin(options);
  res.send({
    data,
  });
});

//user註冊
router.post("/newUser", authController.resgist);

//列出使用者
router.post("/_userToken/userData", async (req, res) => {
  const userToken = req.headers.authorization;
  const data = await userData(userToken);
  res.send({
    data,
  });
});
//更新
router.put("/_userToken/updateUser", async (req, res) => {
  const options = {
    id: req.body.id,
    email: req.body.email,
    headerImg: req.body.headerImg,
  };
  const results = await updateUser(options);
  res.send({
    results,
  });
});
//user發表評論
router.post("/_userToken/writeComment", async (req, res) => {
  const create_time = new Date().getTime();
  const options = {
    id: genid.NextId(),
    blog_id: req.body.blog_id,
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    content: req.body.content,
    header_img: req.body.header_img,
  };
  const data = await userWriteComment(options, create_time);
  res.send({
    data,
  });
});
//admin回復評論
router.post("/_userToken/writeUserReply", async (req, res) => {
  const create_time = new Date().getTime();
  const options = {
    id: genid.NextId(),
    comment_id: req.body.comment_id,
    user_id: req.body.user_id,
    blog_id: req.body.blog_id,
    user_name: req.body.user_name,
    content: req.body.content,
    avatar: req.body.avatar,
  };

  const data = await writeReply(options, create_time);
  res.send({
    data,
  });
});
module.exports = router;
