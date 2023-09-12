const {
  seachBlogComments,
  userWriteComment,
  getBlogCommentCount,
} = require("../models/commentsModel");
const { genid } = require("../utils/Dbutils");

//中間件當前部落格所有評論
exports.findAllBlogCommentData = async (req, res, next) => {
  try {
    const blog_id = Number(req.params.id);
    const data = await getBlogCommentCount(blog_id);
    req.count = data.data;
    next();
  } catch (error) {
    res.status(400).json({
      error,
    });
    return;
  }
};

exports.getBlogComments = async (req, res) => {
  try {
    const blog_id = Number(req.params.id);
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const data = await seachBlogComments(blog_id, page, pageSize);
    const count = req.count;
    res.status(200).json({
      data,
      count,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const id = genid.NextId();
    const create_time = new Date().getTime();
    const options = {
      blog_id: Number(req.body.blog_id),
      user_id: req.user.results.id,
      user_name: req.user.results.account,
      content: req.body.content,
      avatar: req.user.results.avatar,
    };
    const data = await userWriteComment(id, options, create_time);
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
