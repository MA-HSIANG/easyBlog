const connection = require("../config/connection");


//用戶點讚

async function clickLike(options) {
  return new Promise((resolve, reject) => {
    //找該篇有無點讚
    connection.query(
      "select * from click_like where blog_id=? and user_id=?",
      [options.blog_id, options.user_id],

      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (!result[0]) {
          //   用戶沒有點讚
          //   沒有點讚紀錄(有點讚狀態1點讚 0沒點讚)
          connection.query(
            "insert into click_like (id,blog_id,user_id,like_status,create_time) values(?,?,?,?,?)",
            [
              options.id,
              options.blog_id,
              options.user_id,
              1,
              options.create_time,
            ],
            (addErr) => {
              if (addErr) {
                console.log("加入讚時發生錯誤", addErr);
                reject({
                  status: "fail",
                  msg: "伺服器發生異常...請通知管理人員",
                });
              } else {
                resolve({ status: "success" });
              }
            }
          );
        } else {
          //已經點讚了但用戶再次傳點讚狀態
          connection.query(
            "update click_like set like_status=? where id=?",
            [options.like_status, result[0].id],
            (err) => {
              if (err) {
                console.log("再次點在時發生錯誤", err);
                reject({
                  status: "fail",
                  msg: "伺服器發生異常...請通知管理人員",
                });
              } else {
                resolve({ status: "success" });
              }
            }
          );
        }
      }
    );
  });
}
//用戶點讚狀態
async function getLikeStatus(options) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from click_like where blog_id=? and user_id=?",
      [options.blog_id, options.user_id],
      (error, data) => {
        if (error) {
          console.log(error);
          reject({ status: "fail", msg: "伺服器發生錯誤...請聯繫管理人員!!" });
        } else {
          if (data[0]) {
            resolve({ status: "success", data: data[0].like_status });
          }
        }
      }
    );
  });
}
//單篇文章全部點讚數量
async function getBlogAllLikes(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from click_like where blog_id=? and like_status=1",
      [id],
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
//搜尋點讚收藏
async function getSearchLikeBlogs(id, options, offset) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from click_like where user_id=? order by create_time desc limit ? offset ?",
      [id, options.pageSize, offset],
      (error, data) => {
        if (error) {
          console.log(error);
          reject({ status: "fail" });
        } else {
          if (!data) {
            resolve({ status: "", msg: "目前你還每有點讚的內容~~" });
          } else {
            resolve({ status: "success", data });
          }
        }
      }
    );
  });
}
//全部點讚收藏

async function getLikeBlogs(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from click_like where user_id=?",
      [id],
      (error, data) => {
        if (error) {
          console.log(error);
          reject({ status: "fail" });
        } else {
          if (!data) {
            resolve({ status: "", msg: "目前你還每有點讚的內容~~" });
          } else {
            resolve({ status: "success", data });
          }
        }
      }
    );
  });
}
//總網站文章點讚數
async function getWebAllLikes() {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from click_like where like_status=1",
      (error, likes) => {
        if (error) {
          console.log(error);
          reject({ status: "fail", msg: "伺服器發生錯誤...請聯繫管理人員!!" });
        } else {
          if (likes) {
            resolve({ status: "success", likes: likes.length, data: likes });
          } else {
            reject({ status: "fail" });
          }
        }
      }
    );
  });
}
module.exports = {
  clickLike,
  getLikeStatus,
  getBlogAllLikes,
  getSearchLikeBlogs,
  getLikeBlogs,
  getWebAllLikes,
};
