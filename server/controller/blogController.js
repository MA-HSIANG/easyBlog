const {
  createBlog,
  seachBlogs,
  getBlogData,
  getAllBlogData,
  updateBlog,
  deleteBlog,
} = require("../models/blogModel.js");

const { getWebAllViews } = require("../models/blogViewModel.js");
const { getWebAllUserDatas } = require("../models/userModel.js");
const { getWebAllLikes } = require("../models/likeModel.js");
const { getWebAllComments } = require("../models/commentsModel");

const { genid } = require("../utils/Dbutils.js");

//得到所有文章方法
const findAllBlogs = async () => {
  try {
    const data = await getAllBlogData();

    return data;
  } catch (error) {
    return error;
  }
};

//取得所有網站統計資料
exports.getAllWebDatas = async (req, res) => {
  try {
    const allDatas = await Promise.all([
      getWebAllViews(),
      getWebAllUserDatas(),
      getWebAllLikes(),
      getWebAllComments(),
      findAllBlogs(),
    ]);
    res.status(200).json({
      data: allDatas,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
//取得最多點讚文章
exports.get_top3_blog = async (req, res) => {
  try {
    //先得到所有文章
    const blogs = await findAllBlogs();
    const likes = await getWebAllLikes();
    blogs.blogs = blogs.blogs.map((blog) => {
      const index = likes.data.filter((like) => like.blog_id === blog.id);
      //加入讚
      blog.likes = index.length;
      return blog;
    });
    //降序 desc
    blogs.blogs.sort((a, b) => b.likes - a.likes);
    //取前3筆資料
    blogs.blogs = blogs.blogs.slice(0, 3);

    res.status(200).json({
      blogs,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
//獲取搜尋關鍵部落格
exports.getAllSearchBlogs = async (req, res) => {
  try {
    const results = await findAllBlogs();
    const keyword = req.query.keyword;
    const category_name = req.query.category_name;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await seachBlogs(keyword, category_name, page, pageSize);
    res.status(200).json({
      data,
      results: results.blogs.length,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
//獲取最新3則部落格文章
exports.get_new3_blog = async (req, res) => {
  try {
    const page = 1;
    const pageSize = 3;
    const data = await seachBlogs("", "", page, pageSize);
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
//取得單獨部落格
exports.getBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getBlogData(id);

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
};

//新增文章
exports.postBlog = async (req, res, next) => {
  try {
    //文章
    const id = genid.NextId();
    const create_time = new Date().getTime();
    const options = {
      uid: req.user.results.id,
      name: req.user.results.account,
      avatar: req.user.results.avatar,
      category_id: req.body.category_id,
      category_name: req.body.category_name,
      cover_image: req.body.cover_image,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
    };

    const data = await createBlog(id, options, create_time);
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
//修改文章
exports.putBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const options = {
      category_id: req.body.category_id,
      title: req.body.title,
      description: req.body.description,
      cover_image: req.body.cover_image,
      content: req.body.content,
      create_time: new Date().getTime(),
    };

    const data = await updateBlog(id, options);

    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
};
//刪除文章
exports.delBlog = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteBlog(id);
    res.status(204).json({
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
