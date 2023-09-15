const connection = require("../config/connection");

//檢查有無觀看文章 (1.有看過就不動作 2.沒觀看過就新增)
async function articleView(id, options, view_create_time) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from blog_view where blog_id=? and id=?",
      [options.blog_id, id],
      (err, data) => {
        if (err) {
          console.log(err);
          reject({
            status: "fail",
            msg: "資料庫出現問題...請聯繫管理人員或重新訪問...",
          });
        }

        if (!data[0]) {
          connection.query(
            "insert into blog_view (id,blog_id,view_count,view_create_time) values(?,?,?,?)",
            [id, options.blog_id, 1, view_create_time],
            (addErr) => {
              if (addErr) {
                console.log(addErr, "新增觀看紀錄錯誤");
                reject({
                  status: "fail",
                  msg: "資料庫出現問題...請聯繫管理人員或重新訪問...",
                });
              } else {
                resolve({ status: "success" });
              }
            }
          );
        } else {
          return;
        }
      }
    );
  });
}

//全部觀看數量
async function getBlogAllViews(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from blog_view where blog_id=? and view_count=? and status=?",
      [id, 1, 1],
      (error, data) => {
        if (error) {
          console.log(error);
          reject({ status: "fail", msg: "伺服器發生錯誤...請聯繫管理人員!!" });
        } else {
          if (data) {
            resolve({ status: "success", data });
          } else {
            reject({ status: "fail" });
          }
        }
      }
    );
  });
}

//總網站觀看數
async function getWebAllViews() {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from blog_view where status=?",
      [1],
      (error, views) => {
        if (error) {
          console.log(error);
          reject({ status: "fail", msg: "伺服器發生錯誤...請聯繫管理人員!!" });
        } else {
          if (views) {
            resolve({ status: "success", views: views.length, data: views });
          } else {
            reject({ status: "fail" });
          }
        }
      }
    );
  });
}
module.exports = { articleView, getBlogAllViews, getWebAllViews };
