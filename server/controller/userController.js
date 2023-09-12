require("dotenv").config();
const {
  userData,
  updateUser,
  getAllUserData,
  getAllUserPageData,
} = require("../models/userModel.js");
const { getSearchLikeBlogs, getLikeBlogs } = require("../models/likeModel.js");
const { getBlogData } = require("../models/blogModel.js");

const path = require("path");
const fs = require("fs");

//得到單獨部落格方法
const findBlog = async (id) => {
  try {
    const data = await getBlogData(id);

    return data;
  } catch (error) {
    return error;
  }
};

// ----------圖片上傳----------//
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.files) return;
    //上傳檔案
    const files = req.files;
    //返回上傳網址
    const filesImge = [];

    const host = req.hostname;
    const port = process.env.PORT || 3000;
    const serverUrl = `${process.env.YOUR_UPLOAD_IMAGE_URL}://${host}:${port}`;

    for (const file of files) {
      const newFiles = `${file.filename}.jpg`;
      //移動檔案(上傳到temp臨時存放區,移動到圖片區image)
      const sourceFile = path.join(
        __dirname,
        `../public/upload/temp/${file.filename}`
      );

      const targetFile = path.join(
        __dirname,
        `../public/upload/coverImage/${newFiles}`
      );
      fs.renameSync(sourceFile, targetFile);
      filesImge.push(`${serverUrl}/upload/coverImage/${newFiles}`);
    }
    res.status(200).json({
      status: "succsee",
      data: {
        url: filesImge[0],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "伺服器發生錯誤...上傳失敗...",
    });
  }
};
//上傳頭貼
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.files) return;
    //上傳檔案
    const files = req.files;

    //返回上傳網址
    const filesImge = [];

    const host = req.hostname;
    const port = process.env.PORT || 3000;
    const serverUrl = `${process.env.YOUR_UPLOAD_IMAGE_URL}://${host}:${port}`;

    for (const file of files) {
      const newFiles = `user-${file.filename}.jpg`;
      //移動檔案(上傳到temp臨時存放區,移動到圖片區image)
      const sourceFile = path.join(
        __dirname,
        `../public/upload/temp/${file.filename}`
      );

      const targetFile = path.join(
        __dirname,
        `../public/upload/avatar/${newFiles}`
      );
      fs.renameSync(sourceFile, targetFile);
      filesImge.push(`${serverUrl}/upload/avatar/${newFiles}`);
    }

    res.status(200).json({
      status: "succsee",
      data: {
        url: filesImge[0],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "伺服器發生錯誤...上傳失敗...",
    });
  }
};
//獲取單獨user
exports.getUser = async (req, res) => {
  try {
    const id = req.user.results.id;
    const res = await userData(id);

    res.status(200).json({
      data: res,
    });
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
};
//更新
exports.patchUser = async (req, res) => {
  try {
    const id = req.user.results.id;
    const options = {
      avatar: req.body.avatar,
      email: req.body.email,
    };

    const data = await updateUser(id, options);

    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
//取得用戶點讚內容
exports.gatAllUserLikeBlogData = async (req, res) => {
  try {
    const id = req.user.results.id;
    const options = {
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
    };

    const offset = (options.page - 1) * options.pageSize;
    //先取得點讚資料
    const likeDatas = await getSearchLikeBlogs(id, options, offset);
    //所有點讚收藏資料
    const allLikeData = await getLikeBlogs(id);
    const allLike_blogId = [];
    const like_id = [];
    const like_blogs = [];

    //在依照點讚資料顯示有點讚的部落格資料
    for (const likeId of likeDatas.data) {
      like_id.push(likeId.blog_id);
    }
    for (const id of like_id) {
      const blog_data = await findBlog(id);
      like_blogs.push(blog_data.data[0]);
    }
    //取得所有點讚部落格id
    for (const id of allLikeData.data) {
      allLike_blogId.push(id.blog_id);
    }

    res.status(200).json({
      like_blogs,
      counts: allLike_blogId.length,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
//所有用戶
exports.getAllUser = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const results = await getAllUserData();
    const data = await getAllUserPageData(page, pageSize);
    res.status(200).json({
      data,
      results: results.results.length,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
//-------工具函數--------------//
//驗證用找到user
exports.findUser = async (id) => {
  try {
    return await userData(id);
  } catch (error) {
    return error;
  }
};
