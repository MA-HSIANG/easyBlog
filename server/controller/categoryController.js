const {
  gatAllCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getSearchCategory,
} = require("../models/categoryModel");
const { genid } = require("../utils/Dbutils");

//列出所有
exports.getAllCategorys = async (req, res) => {
  try {
    const options = {
      page: req.query.page,
      pageSize: Number(req.query.pageSize),
    };
    const searchData = await getSearchCategory(options);
    const data = await gatAllCategory();
    res.status(200).json({
      data: searchData,
      results: data.data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
    });
  }
};

exports.postCategory = async (req, res) => {
  try {
    const id = genid.NextId();
    const name = req.body.name;
    const data = await createCategory(id, name);
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
exports.delCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteCategory(id);
    res.status(204).json({
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
exports.putCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const data = await updateCategory(id, name);

    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(404).json({
      error,
    });
  }
};
