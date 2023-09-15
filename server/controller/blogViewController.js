const { articleView, getBlogAllViews } = require("../models/blogViewModel");
const { genid } = require("../utils/Dbutils");

exports.getAllBlogViewsCount = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await getBlogAllViews(id);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.createArticleView = async (req, res) => {
  try {
    const id = genid.NextId();
    const options = {
      blog_id: Number(req.params.id),
    };

    const view_create_time = new Date().getTime();
    const data = await articleView(id, options, view_create_time);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getBlogViewCounts = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await getBlogAllViews(id);

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
