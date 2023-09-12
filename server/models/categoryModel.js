const connection = require("../config/connection");

//列出所有加分頁
async function getSearchCategory(options) {
  const offset = (options.page - 1) * options.pageSize;
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from category limit ? offset ?",
      [options.pageSize, offset],
      (error, data) => {
        if (error) {
          console.log(error);
          reject({ status: "fail" });
        } else {
          if (!data) {
            resolve({ status: "success" });
          } else {
            resolve({ status: "success", data });
          }
        }
      }
    );
  });
}

//列出所有
async function gatAllCategory() {
  return new Promise((resolve, reject) => {
    connection.query("select * from category", (err, data) => {
      if (err) {
        reject({
          status: "fail",
          msg: "資料庫出現問題...",
        });
      } else {
        resolve({ status: "success", data });
      }
    });
  });
}

//新增
async function createCategory(id, name) {
  return new Promise((resolve, reject) => {
    //新增分類
    connection.query(
      "insert into category (id,name) values(?,?)",
      [id, name],
      (err) => {
        if (err) {
          reject({
            status: "fail",
            msg: "添加失敗",
          });
        } else {
          resolve({
            status: "success",
            msg: "添加成功",
          });
        }
      }
    );
  });
}
//刪除
async function deleteCategory(id) {
  return new Promise((resolve, reject) => {
    //新增分類
    connection.query("delete from category where id=?", [id], (err) => {
      if (err) {
        reject({
          status: "fail",
          msg: "刪除失敗",
        });
      } else {
        resolve("");
      }
    });
  });
}
//修改
async function updateCategory(id, name) {
  return new Promise((resolve, reject) => {
    connection.query(
      "update category set name=? where id=?",
      [name, id],
      (err) => {
        if (err) {
          reject({ status: "fail", msg: "修改失敗" });
        } else {
          resolve({ status: "success", msg: "修改成功" });
        }
      }
    );
  });
}

module.exports = {
  gatAllCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getSearchCategory,
};
