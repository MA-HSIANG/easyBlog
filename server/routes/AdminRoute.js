const express = require("express");
const router = express.Router();
const { userLists, genid } = require("../db/Dbutils");
const {
  adminLists,
  exlogin,
  insertAdmin,
  updateAdmin,
  delAdmin,
  queryAdmin,
} = require("../db/Admin");
const { userWriteComment, writeReply } = require("../db/comment");
//登入
router.post("/login", async (req, res) => {
  try {
    const params = {
      account: req.body.account,
      password: req.body.password,
    };
    const data = await exlogin("admin", params);
    res.send({
      data,
    });
  } catch (error) {
    console.log(error);
  }
});
//列出所有admin
router.post("/_token/lists", async (req, res) => {
  try {
    const results = await adminLists();
    res.send({ results });
  } catch (error) {
    console.log(error);
  }
});
//列出所有admin
router.post("/_token/adminDate", async (req, res) => {
  try {
    const adminToken = req.headers.authorization;
    const id = "";
    const data = await queryAdmin(id, adminToken);

    res.send({
      data,
    });
  } catch (error) {
    console.log(error);
  }
});
//列出所有user
router.post("/_token/userLists", async (req, res) => {
  try {
    const results = await userLists();
    res.send({ results });
  } catch (error) {
    console.log(error);
  }
});
//新增
router.post("/_token/add", async (req, res) => {
  try {
    const options = {
      account: req.body.account,
      password: req.body.password,
    };
    const result = await insertAdmin(options);
    res.send({ result });
  } catch (error) {
    console.log(error);
  }
});
//修改
router.put("/_token/update", async (req, res) => {
  try {
    const id = req.body.id;
    const options = {
      account: req.body.account,
      password: req.body.password,
    };
    const result = await updateAdmin(id, options);
    res.send({ result });
  } catch (error) {
    console.log(error);
  }
});
//刪除
router.delete("/_token/delete", async (req, res) => {
  try {
    const id = req.body.id;
    const result = await delAdmin(id);
    res.send({ result });
  } catch (error) {
    console.log(error);
  }
});
//admin發表評論
router.post("/_token/writeAdminComment", async (req, res) => {
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
router.post("/_token/writeAdminReply", async (req, res) => {
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
