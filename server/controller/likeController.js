const {
  clickLike,
  getLikeStatus,
  getBlogAllLikes,
} = require("../models/likeModel");
const { genid } = require("../utils/Dbutils");

exports.updateAndCreateLike = async (req, res) => {
  try {
    const options = {
      id: genid.NextId(),
      blog_id: Number(req.params.id),
      user_id: req.user.results.id,
      create_time: new Date().getTime(),
      like_status: Number(req.body.like_status),
    };

    options.like_status === 0
      ? (options.like_status = 1)
      : (options.like_status = 0);

    const result = await clickLike(options);

    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
//用戶看自己狀態
exports.getLikeStatus = async (req, res) => {
  try {
    const options = {
      blog_id: req.params.id,
      user_id: req.user.results.id,
    };

    const likeStatus = await getLikeStatus(options);
    res.status(200).json({
      likeStatus,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
//單獨部落格全部用戶點讚數
exports.getAllBlogLikeDatas = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getBlogAllLikes(id);
    
    res.status(200).json({
      count: data.data.length,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
