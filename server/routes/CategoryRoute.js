const express = require("express");
const router = express.Router();
const {
  addClass,
  delClass,
  allList,
  updateClass,
  queryCategoryId,
} = require("../db/Category");
const { genid } = require("../db/Dbutils");
//列出所有
router.get("/list", async (req, res) => {
  try {
    const results = await allList();
    res.send({
      results,
    });
  } catch (error) {
    console.log(error);
  }
});

//添加
router.post("/_token/add", async (req, res) => {
  try {
    const id = genid.NextId();
    const name = req.body.name;

    const result = await addClass(id, name);
    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
//刪除
router.delete("/_token/del", async (req, res) => {
  //後端執行刪除
  try {
    const id = req.body.id;
    const result = await delClass(id);
    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
//修改
router.put("/_token/update", async (req, res) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const result = await updateClass(id, name);
    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
//查詢文章發佈者
router.post("/_token/queryCategory", async (req, res) => {
  try {
    const id = req.body.id;
    const result = await queryCategoryId(id);
    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
