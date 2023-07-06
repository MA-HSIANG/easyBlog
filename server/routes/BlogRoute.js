const express = require("express");
const router = express.Router();
const {
  addBlog,
  delBlog,
  queryBlog,
  seachQuery,
  updateBlog,
  queryBlogId,
} = require("../db/Blogs");
const {
  seachBlogComment,
  queryBlogComment,
  queryCommentUser,
  dashBoardAllComments,
  writeReply,
  queryCommentReply,
  seachCommentReply,
  dashBoardDeleteComment,
  dashBoardDeleteReply,
} = require("../db/comment");
const {
  checkLikeStatus,
  clickLike,
  allLike,
  userLikeLists,
  userLikeListAll,
  dashBoardAllLike,
  dashBoardDeleteLikeCount,
} = require("../db/Like");
const {
  watchArticle,
  allWatchCounts,
  allWatch,
  dashBoardDeleteWatchCount,
} = require("../db/Watch");
const { genid } = require("../db/Dbutils");
const { queryAdmin } = require("../db/Admin");
//列出所有文章
router.get("/list", async (req, res) => {
  try {
    const results = await queryBlogId();
    res.send({
      results,
    });
  } catch (error) {
    console.log(error);
  }
});
//新增文章
router.post("/_token/post", async (req, res) => {
  try {
    const id = genid.NextId();
    const create_time = new Date().getTime();
    const options = {
      uid: req.body.uid,
      category_id: req.body.category_id,
      cover_image: req.body.cover_image,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
    };

    const result = await addBlog(id, options, create_time);
    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
//刪除文章 (1.刪除讚 2.刪除留言 3.刪除觀看數 4.刪除回復)
router.delete("/_token/delete", async (req, res) => {
  try {
    const id = req.query.id;
    const data = await delBlog(id);
    const likeData = await dashBoardDeleteLikeCount(id);
    const commentData = await dashBoardDeleteComment(id);
    const watchData = await dashBoardDeleteWatchCount(id);
    const replyData = await dashBoardDeleteReply(id);
    if (
      data.code === 200 &&
      likeData.code === 200 &&
      commentData.code === 200 &&
      watchData.code === 200 &&
      replyData.code === 200
    ) {
      res.send({
        data,
      });
    } else {
      throw new Error(`刪除時有資料無法刪除blog:${data} like${likeData}`);
    }
  } catch (error) {
    console.log(error);
  }
});
//搜尋文章
router.get("/search", async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const category_id = req.query.category_id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const datas = await seachQuery(keyword, category_id, page, pageSize);
    const count = await queryBlog();
    res.send({
      datas,
      count,
    });
  } catch (error) {
    console.log(error);
  }
});
//列出舊文章
router.get("/oldData", async (req, res) => {
  const id = req.query.id;
  const oldData = await queryBlogId(id);
  res.send({
    oldData,
  });
});
//更新文章
router.put("/_token/updata", async (req, res) => {
  try {
    const id = req.body.id;
    const options = {
      category_id: req.body.category_id,
      title: req.body.title,
      description: req.body.description,
      cover_image: req.body.cover_image,
      content: req.body.content,
      create_time: new Date().getTime(),
    };

    const newDatas = await updateBlog(id, options);
    res.send({
      newDatas,
    });
  } catch (error) {
    console.log(error);
  }
});
//查詢文章發佈者
router.post("/queryAdmin", async (req, res) => {
  try {
    const id = req.body.id;
    const result = await queryAdmin(id);
    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
//列出文章評論
router.get("/allComment", async (req, res) => {
  try {
    const blog_id = req.query.blog_id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await seachBlogComment(blog_id, page, pageSize);
    const count = await queryBlogComment(blog_id);
    res.send({
      data,
      count,
    });
  } catch (error) {
    console.log(error);
  }
});
//列出所有回復
router.get("/allReply", async (req, res) => {
  try {
    const comment_id = req.query.comment_id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await seachCommentReply(comment_id, page, pageSize);
    const count = await queryCommentReply(comment_id);

    res.send({
      data,
      count,
    });
  } catch (error) {
    console.log(error);
  }
});
//列出評論使用者資料
router.get("/allCommentDatas", async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const data = await queryCommentUser(user_id);
    res.send({
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

//列出使用者點讚文章
router.post("/_userToken/blogLikeList", async (req, res) => {
  try {
    const options = {
      user_id: req.body.user_id,
      page: req.body.page || 1,
      pageSize: req.body.pageSize || 10,
    };
    const result = await userLikeLists(options);
    const count = await userLikeListAll(options);
    res.send({
      result,
      count,
    });
  } catch (error) {
    console.log(error);
  }
});
//當前使用者點讚狀態
router.post("/_userToken/blogLike", async (req, res) => {
  try {
    const options = {
      id: genid.NextId(),
      blog_id: req.body.blog_id,
      user_id: req.body.user_id,
    };
    const result = await checkLikeStatus(options);
    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
//使用者點讚和除讚
router.post("/_userToken/clickBlogLike", async (req, res) => {
  try {
    const options = {
      id: genid.NextId(),
      blog_id: req.body.blog_id,
      user_id: req.body.user_id,
      create_time: new Date().getTime(),
    };
    const results = await clickLike(options);
    res.send({ results });
  } catch (error) {
    console.log(error);
  }
});
//列出當前文章總讚數
router.post("/allLikes", async (req, res) => {
  try {
    const options = {
      blog_id: req.body.blog_id,
    };
    const result = await allLike(options);
    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
  }
});
//用戶文章觀看紀錄
router.post("/_userToken/watchArticle", async (req, res) => {
  try {
    const options = {
      id: genid.NextId(),
      blog_id: req.body.blog_id,
      user_id: req.body.user_id,
    };

    const results = await watchArticle(options);
    res.send({
      results,
    });
  } catch (error) {
    console.log(error);
  }
});
//單篇文章觀看數
router.post("/allWatch", async (req, res) => {
  try {
    const options = {
      blog_id: req.body.blog_id,
    };
    const results = await allWatch(options);
    res.send({
      results,
    });
  } catch (error) {
    console.log(error);
  }
});

//------------------dashBoard---------------////
//後台總讚數
router.post("/_token/allLikeCount", async (req, res) => {
  try {
    const results = await dashBoardAllLike();
    res.send({
      results,
    });
  } catch (error) {
    console.log(error);
  }
});
//後台最新總留 || 總留言
router.post("/_token/allComments", async (req, res) => {
  try {
    const new_num = req.body.new_num;
    const results = await dashBoardAllComments(new_num);
    res.send({
      results,
    });
  } catch (error) {
    console.log(error);
  }
});
//後台總觀看數
router.get("/_token/allWatchCounts", async (req, res) => {
  try {
    const counts = await allWatchCounts();
    res.send({ counts });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
